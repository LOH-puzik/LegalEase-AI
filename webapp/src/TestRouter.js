import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';

function TestRouter() {
  return (
    <Router>
      <div>
        <Link to="/">Home</Link>
        <Link to="/test">Test</Link>
      </div>

      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/test" element={<h1>Test</h1>} />
      </Routes>
    </Router>
  );
}

export default TestRouter;
