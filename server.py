from includes.dependencies import *

app = Flask(__name__)
CORS(app)

document_store = PineconeDocumentStore(
    environment='us-west4-gcp-free',
    api_key='',
    index='text',
    similarity="cosine",
    embedding_dim=768
)

retriever = EmbeddingRetriever(
   document_store=document_store,
   embedding_model="flax-sentence-embeddings/all_datasets_v3_mpnet-base",
   model_format="sentence_transformers"
)

generator = Seq2SeqGenerator(model_name_or_path="vblagoje/bart_lfqa")

pipe = GenerativeQAPipeline(generator, retriever)

bert_tokenizer = BertTokenizerFast.from_pretrained("bert-base-uncased")
bert_summarizer = pipeline("summarization", device=0)

def bert_len(text):
    tokens = bert_tokenizer.encode(
        text,
        add_special_tokens=True,
        max_length=len(text),
        truncation=True
    )
    return len(tokens)

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,  
    chunk_overlap=30,
    length_function=bert_len,
    separators=[". ", ""]
)

def extract_text_from_pdf(file):
    """
    Extracts text from a PDF file.

    Args:
        file (str): Path to the PDF file.

    Returns:
        str: Extracted text from the PDF.
    """
    try:
        with pdfplumber.open(file) as pdf:
            text = ''.join(page.extract_text() for page in pdf.pages)
        return text
    except Exception as e:
        print(f'Error extracting text from PDF: {e}')
        return None

def remove_duplicates(text):
    """
    Removes duplicate sentences from the text.

    Args:
        text (str): Input text.

    Returns:
        str: Text with duplicate sentences removed.
    """
    seen = set()
    return ". ".join([sentence for sentence in text.split(". ") if sentence not in seen and not seen.add(sentence)])

def generate_summary(text):  
    """
    Generates a summary of the input text.

    Args:
        text (str): Input text.

    Returns:
        str: Generated summary.
    """
    summary = bert_summarizer(text, max_length=500, min_length=25, do_sample=False)
    return summary[0]['summary_text']

def summarize_chunks(text):
    """
    Splits the text into chunks, summarizes each chunk, and combines them.

    Args:
        text (str): Input text.

    Returns:
        str: Summarized text.
    """
    chunks = text_splitter.split_text(text)
    chunk_summaries = [generate_summary(chunk) for chunk in chunks]
    text = ". ".join(chunk_summaries)
    text = remove_duplicates(text)
    return text

def arrange_text(text):
    """
    Arranges the text by formatting and cleaning.

    Args:
        text (str): Input text.

    Returns:
        str: Formatted and cleaned text.
    """
    text = re.sub(r'\.\.', '.', text)
    text = re.sub(r' \.', '.', text)
    text = re.sub(r'\.', '.\n', text)
    text = re.sub(r' +', ' ', text)
    text = re.sub(r'(^|\n)([^\n])', r'\1• \2', text)
    text = re.sub(r'\n•  +$', '', text)
    return text

def generate_explanation(text, device='cpu'):
    """
    Generates an explanation for the given text.

    Args:
        text (str): Input text.
        device (str): Device to use ('cpu' or 'cuda').

    Returns:
        tuple: Explanation text and formatted input text.
    """
    pegasus_tokenizer = AutoTokenizer.from_pretrained("google/bigbird-pegasus-large-bigpatent")
    pegasus_model = BigBirdPegasusForConditionalGeneration.from_pretrained("google/bigbird-pegasus-large-bigpatent")
    device = torch.device(device)
    pegasus_model.to(device)
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
    del inputs
    del explanation_ids
    del pegasus_model
    del pegasus_tokenizer
    torch.cuda.empty_cache()
    text = explanation, 'Here are the most important points:' '\n\n', arrange_text(text)
    return text

def summarize_doc(text):
    """
    Summarizes a document.

    Args:
        text (str): Input document text.

    Returns:
        tuple: Explanation text and formatted summary.
    """
    text = summarize_chunks(text)
    while len(text.split()) > 1500:
        text = summarize_chunks(text)
    
    text = generate_explanation(text)
    return text

@app.route('/chat', methods=['POST'])
def chat():
    """
    Chatbot endpoint.

    Returns:
        dict: JSON response containing the chatbot's message.
    """
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

@app.route('/doc', methods=['POST'])
def upload_file():
    """
    Document Analyzer endpoint.

    Returns:
        dict: JSON response containing the document summary.
    """
    file = request.files['file']
    if not file or not file.filename.lower().endswith('.pdf'):
        return 'Invalid or missing PDF file'

    document_text = extract_text_from_pdf(file)
    if not document_text:
        return 'Error extracting text from PDF'

    summary = summarize_doc(document_text)
    return {"summary": summary}

@app.route('/predict', methods=['POST'])
def predict():
    """
    Prediction endpoint.

    Returns:
        dict: JSON response containing the model prediction.
    """
    data = request.get_json()

    caseType = data.get('caseType')
    bulletPoints = data.get('bulletPoints')
    paragraphs = data.get('paragraphs')
    articles = data.get('articles')
    guilty = data.get('guilty')

    input_data = [[caseType, bulletPoints, paragraphs, articles, guilty]]

    with open('./models/pred.pkl', 'rb') as f:
        model = pickle.load(f)

    prediction = model.predict(input_data)

    return {'prediction': prediction.tolist()}  # convert prediction to list for JSON serialization

if __name__ == '__main__':
    app.run(port=5000)
