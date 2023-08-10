import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Background from './Background';
import Header from './Header';
import HomePage from './HomePage';

import AILegalCoun from './pages/AILegalCoun';
import LegalDocAnalyzer from './pages/LegalDocAnalyzer';
import CasePred from './pages/CasePred';

import { ChakraProvider } from '@chakra-ui/react'



function App() {

  return (
    <Router>
      <Background />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/ai-legal-counsel" element={<AILegalCoun />} />
        <Route path="/legal-doc-assistant" element={<LegalDocAnalyzer />} />
        <Route path="/case-predictor" element={<CasePred />} />
      </Routes>
    </Router>  
  );  
  }

export default App;
