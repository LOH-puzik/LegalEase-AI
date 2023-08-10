import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const popIn = keyframes`
  0% { transform: scale(0.5); }
  100% { transform: scale(1); }
`;

const popOut = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(0.5); }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${({ closing }) => (closing ? fadeOut : fadeIn)} 0.2s ease;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background-color: #eef4f2;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  animation: ${({ closing }) => (closing ? popOut : popIn)} 0.2s ease;
  overflow-y: auto;
  max-height: 600px;
  max-width: 500px;
  align-items: center;
  justify-content: center;

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

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  font-size: 1.2em;
  cursor: pointer;
`;

function Modal({ onClose, children }) {
  const [closing, setClosing] = useState(false);
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 200);
  };

  return (
    <ModalBackdrop closing={closing} onClick={handleClose}>
      <ModalContent closing={closing} onClick={(e) => e.stopPropagation()}>
        {children}
        <CloseButton onClick={handleClose}>&times;</CloseButton>
      </ModalContent>
    </ModalBackdrop>
  );
}

export default Modal;
