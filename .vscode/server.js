// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS so your Flutter frontend can talk to this backend
app.use(cors());
app.use(express.json());

// POST endpoint to receive prompts and return a mock image URL
app.post('/generate', (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt text ✨' });
  }

  // Simulated response with fantasy-style placeholder image
  const imageUrl = `https://placehold.co/600x400?text=${encodeURIComponent(prompt)}`;

  res.json({
    success: true,
    prompt,
    image: imageUrl,
    message: '🧞‍♀️ Your image has been conjured!'
  });
});

// Fallback route
app.get('/', (req, res) => {
  res.send('✨ Aurahh API is alive and shimmering.');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔮 Aurahh API is listening on port ${PORT}`);
});