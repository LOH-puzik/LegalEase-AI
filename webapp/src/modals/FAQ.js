import React from 'react';
import styled from '@emotion/styled';

import Modal from './Modal';


const Question = styled.li`
  font-weight: bold;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  margin-bottom: 10px;
`;

const Answer = styled.p`
  font-weight: normal;
  color: #666;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  margin-bottom: 20px;
`;

function FAQ({ onClose }) {
  return (
      <Modal onClose={onClose}>
        <ul>
          <Question>What is LegalEaseAI?</Question>
          <Answer>
          LegalEaseAI is a web app that offers a range of legal services powered by advanced artificial intelligence. It can provide legal counsel, analyze, summarize, and draft legal documents, and predict case outcomes. LegalEaseAI aims to simplify and streamline legal processes, saving users time and effort.
          </Answer>
          <Question>How does LegalEaseAI provide legal counsel?</Question>
          <Answer>
          LegalEaseAI uses advanced AI algorithms, specifically Large Language Models (LLMs) and Natural Language Processing (NLP), to understand and interpret user queries. It generates accurate, easy-to-understand responses, providing instant legal counsel on various topics.
          </Answer>
          <Question>Can LegalEaseAI draft legal documents?</Question>
          <Answer>
          Yes, LegalEaseAI can generate legal documents based on user requirements. It uses AI algorithms to produce contextually appropriate content, assisting users in drafting contracts, agreements, or legal letters.
          </Answer>
          <Question>How does LegalEaseAI summarize legal documents?</Question>
          <Answer>
          LegalEaseAI employs AI algorithms to comprehend complex legal jargon and extract essential information from lengthy documents. It presents the most crucial information concisely, saving users time and effort by providing easily digestible summaries.
          </Answer>
          <Question>Can LegalEaseAI predict case outcomes?</Question>
          <Answer>
          LegalEaseAI can predict case outcomes by analyzing historical cases and identifying patterns and trends within legal data. It forecasts potential outcomes, helping users make strategic decisions and prepare for various legal scenarios.
          </Answer>
          <Question>How does LegalEaseAI handle data privacy?</Question>
          <Answer>
          LegalEaseAI takes data privacy very seriously. We do not store or sell any user data. All data processed by LegalEaseAI is treated with the utmost confidentiality, ensuring the privacy and security of your information.
          </Answer>
          <Question>How is LegalEaseAI different from traditional legal services?</Question>
          <Answer>
          LegalEaseAI harnesses the power of AI to offer quick, accurate, and affordable legal services. Traditional legal services typically involve human experts and can be time-consuming and costly. LegalEaseAI aims to make legal assistance more accessible, efficient, and user-friendly.
          </Answer>
          <Question>Can I trust the accuracy of LegalEaseAI's services?</Question>
          <Answer>
          LegalEaseAI uses state-of-the-art AI algorithms to provide its services. While the AI strives to deliver accurate and reliable information, it is essential to consult with a legal professional for specific legal advice tailored to your unique situation.
          </Answer>
          <Question>How can I get started with LegalEaseAI?</Question>
          <Answer>
          To get started with LegalEaseAI, simply explore the available features. You can begin using the web app to access legal counsel, draft documents, analyze and summarize legal documents, and predict case outcomes.
          </Answer>
        </ul>
      </Modal>
  );
}

export default FAQ;