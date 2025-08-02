// 📦 Dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 🔓 Load .env variables
dotenv.config();

// 🚀 Initialize Express app
const app = express();

// 🛡 Enable CORS for all requests
app.use(cors()); // 👈 Essential for Flutter Web & cross-origin access

// 📦 Parse JSON bodies
app.use(express.json());

// 🔮 Route for image generation
const generateRoute = require('./routes/generate'); // Make sure this path is correct
app.use('/generate', generateRoute);

// 🧪 Optional health check route
app.get('/health', (req, res) => {
  res.send('Aurahh backend is glowing ✨');
});

// 🌐 Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Aurahh API running on port ${PORT} 🚀`);
});