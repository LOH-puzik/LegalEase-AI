import React from 'react';
import styled from '@emotion/styled';

import Modal from './Modal';


const Text = styled.p`
  font-weight: bold;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  margin: 0;
  padding: 20px;
  text-align: center;
  line-height: 1.6;
`;

function Tec({ onClose }) {
  return (
    <Modal onClose={onClose}>
        <Text>
LegalEaseAI is an innovative and ambitious web app that offers legal counsel, summarizes, drafts, and analyzes legal documents, and predicts cases and lawsuits. By utilizing Artificial Intelligence, specifically Large Language Models (LLMs) and Natural Language Processing (NLP), LegalEaseAI has the potential to revolutionize the legal landscape.<br /><br />

LLMs are advanced AI algorithms that learn from vast amounts of textual data, allowing them to recognize patterns and relationships between words and phrases. As a result, they can generate coherent and contextually accurate language-related responses. NLP is a subfield of AI that helps machines understand, interpret, and produce human language meaningfully.<br /><br />

By combining LLMs and NLP, LegalEaseAI can handle various language-related tasks in the legal domain. For example, it can provide users with instant legal counsel by understanding their questions and generating accurate, easily digestible responses. LegalEaseAI can comprehend complex legal jargon and present it in a way that non-technical users can understand.<br /><br />

LegalEaseAI can also rapidly summarize lengthy legal documents, saving users time and effort by presenting the most crucial information concisely. Its drafting capabilities allow it to generate legal documents based on users' requirements and produce contextually appropriate content, greatly assisting users in drafting contracts, agreements, or legal letters.<br /><br />

By leveraging LLMs and NLP, LegalEaseAI can analyze legal documents, extract vital information, and identify potential issues or risks. This functionality enables users to make informed decisions and proactively mitigate potential problems. LegalEaseAI can also predict cases and lawsuits by identifying patterns and trends within legal data. By analyzing historical cases, it can forecast potential outcomes, helping users make strategic decisions and prepare for various legal scenarios.</Text>
    </Modal>
  );
}

export default Tec;
