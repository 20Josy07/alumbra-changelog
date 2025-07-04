```javascript
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS to allow requests from your GitHub Pages frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Endpoint to handle form submissions
app.post('/submit-feedback', async (req, res) => {
  const { type, title, description } = req.body;

  if (!type || !title || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const issueTitle = `${type === 'bug' ? 'Bug: ' : 'Feature: '}${title}`;
  const issueBody = `**Type**: ${type}\n**Description**: ${description}`;

  try {
    const response = await axios.post(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/issues`,
      {
        title: issueTitle,
        body: issueBody,
        labels: [type], // Add label like "bug" or "feature"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    res.json({ message: 'Issue created successfully', issue: response.data });
  } catch (error) {
    console.error('Error creating GitHub issue:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create issue', details: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app VEHICLE('Server running on port ${PORT}');
});
```
