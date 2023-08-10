import random
import re
import torch
import pdfplumber
import pickle
from flask import Flask, request
from flask_cors import CORS
from haystack.pipelines import GenerativeQAPipeline
from haystack.nodes import EmbeddingRetriever
from haystack.nodes import Seq2SeqGenerator
from haystack.document_stores import PineconeDocumentStore

from langchain.text_splitter import RecursiveCharacterTextSplitter
from transformers import BertTokenizerFast, BigBirdPegasusForConditionalGeneration, AutoTokenizer, pipeline

app = Flask(__name__)
CORS(app)

# PineconeDocumentStore instance
document_store = PineconeDocumentStore(
    environment='us-west4-gcp-free',
    api_key='',
    index='text',
    similarity="cosine",
    embedding_dim=768
)

# EmbeddingRetriever instance
retriever = EmbeddingRetriever(
   document_store=document_store,
   embedding_model="flax-sentence-embeddings/all_datasets_v3_mpnet-base",
   model_format="sentence_transformers"
)

# Seq2SeqGenerator instance
generator = Seq2SeqGenerator(model_name_or_path="vblagoje/bart_lfqa")

# Building the pipeline
pipe = GenerativeQAPipeline(generator, retriever)

# Initialize Bert summarizer & tokenizer
bert_tokenizer = BertTokenizerFast.from_pretrained("bert-base-uncased")
bert_summarizer = pipeline("summarization", device=0)

# Measure the length of a text
def bert_len(text):
    tokens = bert_tokenizer.encode(
        text,
        add_special_tokens=True,
        max_length=len(text),
        truncation=True
    )
    return len(tokens)

# Text splitter initialization
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,  
    chunk_overlap=30,
    length_function=bert_len,
    separators=[". ", ""]
)

def extract_text_from_pdf(file):
    try:
        with pdfplumber.open(file) as pdf:
            text = ''.join(page.extract_text() for page in pdf.pages)
        return text
    except Exception as e:
        print(f'Error extracting text from PDF: {e}')
        return None
    
# Remove duplicate sentences from the text 
def remove_duplicates(text):
    seen = set()
    return ". ".join([sentence for sentence in text.split(". ") if sentence not in seen and not seen.add(sentence)])

# Summarize a text
def generate_summary(text):  
    summary = bert_summarizer(text, max_length=500, min_length=25, do_sample=False)
    return summary[0]['summary_text']

# Join the chunks together and summarize them
def summarize_chunks(text):
    chunks = text_splitter.split_text(text)
    chunk_summaries = [generate_summary(chunk) for chunk in chunks]
    text = ". ".join(chunk_summaries)
    text = remove_duplicates(text)
    return text

# Arrange the summary
def arrange_text(text):
    # Replace ".." by "."
    text = re.sub(r'\.\.', '.', text)
    # Replace " ." by "."
    text = re.sub(r' \.', '.', text)
    # Return to line after each "."
    text = re.sub(r'\.', '.\n', text)
    # Replace "  " by " " and "   " by " "
    text = re.sub(r' +', ' ', text)
    # Add "•" before the start of any sentence
    text = re.sub(r'(^|\n)([^\n])', r'\1• \2', text)
    # Remove trailing bullet points
    text = re.sub(r'\n•  +$', '', text)
    return text

def generate_explanation(text, device='cpu'):
    # Initialize the model & tokenizer
    pegasus_tokenizer = AutoTokenizer.from_pretrained("google/bigbird-pegasus-large-bigpatent")
    pegasus_model = BigBirdPegasusForConditionalGeneration.from_pretrained("google/bigbird-pegasus-large-bigpatent")   
    # Check if a GPU is available and if not, use a CPU
    device = torch.device('cpu')    
    # Move the model to the device
    pegasus_model.to(device)
    # Define the inputs
    explanation_input = "explain this " + text
    inputs = pegasus_tokenizer(explanation_input, return_tensors='pt').to(device)
    explanation_ids = pegasus_model.generate(
        **inputs,
        max_length=256, 
        do_sample=True, 
        num_beams=5, 
        length_penalty=0.9,
        repetition_penalty=1.4
    )
    explanation = pegasus_tokenizer.decode(explanation_ids[0], skip_special_tokens=True)   
    # Delete the tensors
    del inputs
    del explanation_ids
    # Delete the models and tokenizer
    del pegasus_model
    del pegasus_tokenizer    
    # Empty the cache
    torch.cuda.empty_cache()
    text = explanation, 'Here are the most important points:' '\n\n', arrange_text(text)
    return text

def summarize_doc(text):
    text = summarize_chunks(text)
    # Check if the summarized text length is over 1500 words
    while len(text.split()) > 1500:
        text = summarize_chunks(text)
    
    text = generate_explanation(text)
    return text    


# Chatbot endpoint
@app.route('/chat', methods=['POST'])
def chat():
    input_text = request.json.get('message')

    result = pipe.run(
        query=input_text,
        params={
            "Retriever": {"top_k": 15},
            "Generator": {"top_k": 5}
        })

    max_score = max(result['answers'][0].meta['doc_scores'])

    response_list = [
        "It seems this is beyond my knowledge, or I didn't understand your question. Could you please rephrase it?",
        "I'm afraid that's beyond my comprehension, or perhaps I misunderstood your question. Would you mind rephrasing it?",
        "This might be outside my expertise, or maybe your question wasn't clear. Could you please try again?"
    ]

    if max_score < 0.62:
        output_text = random.choice(response_list)
    else:
        output_text = result['answers'][0].answer

    return {'message': output_text}


# Doc Analyser endpoint
@app.route('/doc', methods=['POST'])
def upload_file():
    file = request.files['file']
    if not file or not file.filename.lower().endswith('.pdf'):
        return 'Invalid or missing PDF file'

    # Extract text from the PDF file
    document_text = extract_text_from_pdf(file)
    if not document_text:
        return 'Error extracting text from PDF'

    # Summarize the document and return the summary as a JSON response
    summary = summarize_doc(document_text)
    return {"summary": summary}


# Predict endpoint
@app.route('/predict', methods=['POST'])
def predict():
    # Retrieve input data
    data = request.get_json()

    caseType = data.get('caseType')
    bulletPoints = data.get('bulletPoints')
    paragraphs = data.get('paragraphs')
    articles = data.get('articles')
    guilty = data.get('guilty')

    # Put the data into the right format for your model
    # This is just an example, you need to adjust it to the needs of your model
    input_data = [[caseType, bulletPoints, paragraphs, articles, guilty]]

    # Make a prediction
    with open('./models/pred.pkl', 'rb') as f:
        model = pickle.load(f)

    prediction = model.predict(input_data)

    # Return the prediction
    return {'prediction': prediction.tolist()}  # convert prediction to list for JSON serialization

if __name__ == '__main__':
    app.run(port=5000)