const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/chat', (req, res) => {
  const userInput = req.body.message;

  // You'd replace this with the actual call to your LLM
  const llmResponse = 'Response from LLM: ' + userInput;

  res.json({ message: llmResponse });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
