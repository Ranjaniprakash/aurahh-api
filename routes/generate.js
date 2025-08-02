// 📦 Dependencies
const express = require('express');
const axios = require('axios');
const router = express.Router();

// 🔮 POST /generate
router.post('/', async (req, res) => {
  const { prompt, style } = req.body;
  const apiKey = process.env.REPLICATE_API_TOKEN;

  // 🚧 Input validation
  if (!prompt || !style) {
    return res.status(400).json({ error: 'Prompt and style are required.' });
  }

  try {
    // 📤 Create prediction
    const create = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'db21e45fc4df60c0e3df0c7a27156c7c63e48ab671172c7683f3bff6b91b6c46',
        input: {
          prompt: `${style}: ${prompt}`,
          width: 512,
          height: 512,
          num_outputs: 1,
          num_inference_steps: 25,
        },
      },
      {
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const predictionId = create.data.id;

    // 🔁 Polling loop
    let output = null;
    let retries = 0;
    while (!output && retries < 30) {
      const poll = await axios.get(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            Authorization: `Token ${apiKey}`,
          },
        }
      );

      const status = poll.data.status;
      if (status === 'succeeded') {
        output = poll.data.output[0];
      } else if (status === 'failed') {
        return res.status(500).json({ error: 'Image generation failed.' });
      } else {
        retries++;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!output) {
      return res.status(504).json({ error: 'Timed out waiting for image generation.' });
    }

    // 🎉 Return result
    res.json({ image: output });

  } catch (err) {
    console.error('Error during generation:', err.message);
    res.status(500).json({ error: 'Backend error during image generation.' });
  }
});

module.exports = router;