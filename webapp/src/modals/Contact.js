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
`;

function Contact({ onClose }) {
  return (
    <Modal onClose={onClose}>
        <Text>EMAIL: dhiaeddinebattikh@gmail.com</Text>
        <Text>LINKEDIN: https://www.linkedin.com/in/dhiabattikh/</Text>
    </Modal>
  );
}
  
  export default Contact;