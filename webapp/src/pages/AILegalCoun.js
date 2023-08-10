import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';

//make a small window to tell users that they should ask questions in third perrson (can I smoke inside? -> can someone smoke inside?)
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 65%;
  width: 65%;
  background-color: rgba(211, 211, 211, 0.08);
  border-radius: 4px;
  justify-content: space-between;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const MessagesContainer = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  margin-bottom: 10px;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const Message = styled.div`
  background-color: ${({ userMessage }) => (userMessage ? '#9999' : '#9999')};
  color: white;
  padding: 10px;
  border-radius: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  align-self: ${({ userMessage }) => (userMessage ? 'flex-end' : 'flex-start')};
  max-width: 60%;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
`;

const InputField = styled.input`
  flex-grow: 0.99;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SendButton = styled.button`
  padding: 10px;
  background-color: #eef4f2;
  font-weight: bold;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  border: none;
  cursor: pointer;
  border-radius: 4px;
`;

const LoadingDotsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Dot = styled.div`
  background-color: #eef4f2;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  margin: 3px;

  &:nth-child(1) {
    animation: dot 1.2s infinite;
  }
  &:nth-child(2) {
    animation: dot 1.2s infinite 0.2s;
  }
  &:nth-child(3) {
    animation: dot 1.2s infinite 0.4s;
  }

  @keyframes dot {
    0%, 80%, 100% {
      transform: scale(0.4);
    } 
    40% {
      transform: scale(1.0);
    }
  }
`;

function AILegalCoun() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const loadingIndices = useRef([]);  // a queue to hold the indices of loading messages

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim()) {
      const userMessage = { content: inputValue, userMessage: true };
      setMessages((messages) => [...messages, userMessage]);
      setInputValue('');
      setIsLoading(true);

      // placeholder for server response
      const botMessage = { content: <LoadingDotsContainer><Dot /><Dot /><Dot /></LoadingDotsContainer>, userMessage: false };
      setMessages((messages) => {
        const updatedMessages = [...messages, botMessage];
        loadingIndices.current.push(updatedMessages.length - 1);  // add the index of the loading message to the queue
        return updatedMessages;
      });

      // make a POST request to your Flask backend
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await response.json();

      setIsLoading(false);
      receiveResponse(data.message);
    }
  };

  const receiveResponse = (botResponse) => {
    const botMessage = { content: botResponse, userMessage: false };
    setMessages((messages) => {
      const updatedMessages = [...messages];
      const loadingIndex = loadingIndices.current.shift();  // get the earliest loading message that has not yet been replaced
      if (loadingIndex !== undefined) {
        updatedMessages[loadingIndex] = botMessage;
      }
      return updatedMessages;
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };
  return (
    <>
      <ChatContainer>
        <MessagesContainer>
          {messages.map((message, index) => (
            <Message key={index} userMessage={message.userMessage}>
              {message.content}
            </Message>
          ))}
          <div ref={messagesEndRef}></div>
        </MessagesContainer>
        <InputContainer>
          <InputField
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />
          <SendButton onClick={handleSend}>Send</SendButton>
        </InputContainer>
      </ChatContainer>
    </>
  );
}

export default AILegalCoun;