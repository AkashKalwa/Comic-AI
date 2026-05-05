# AI Image Generation Integration Guide

The app currently uses Lorem Picsum (random photos) as a placeholder. To enable true AI-generated images, integrate one of these services:

## Option 1: Replicate (Recommended)

Replicate offers pay-per-use pricing with excellent models like FLUX and Stable Diffusion.

### Setup:
1. Sign up at https://replicate.com
2. Get your API token from https://replicate.com/account/api-tokens
3. Install the SDK:
```bash
npm install replicate
```

4. Update `server.js`:
```javascript
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.post('/api/generate-image', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "jpg"
        }
      }
    );
    
    // output is an array of URLs
    const imageResponse = await fetch(output[0]);
    const imageBuffer = await response.arrayBuffer();
    res.set('Content-Type', 'image/jpeg');
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

5. Add to `.env`:
```
REPLICATE_API_TOKEN=your_token_here
```

**Cost:** ~$0.003 per image with FLUX Schnell

## Option 2: Stability AI

### Setup:
1. Sign up at https://platform.stability.ai
2. Get API key from dashboard
3. Update `server.js`:
```javascript
app.post('/api/generate-image', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const response = await fetch(
      'https://api.stability.ai/v2beta/stable-image/generate/sd3',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
          'Accept': 'image/*'
        },
        body: JSON.stringify({
          prompt: prompt,
          output_format: 'jpeg'
        })
      }
    );
    
    const imageBuffer = await response.arrayBuffer();
    res.set('Content-Type', 'image/jpeg');
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Cost:** ~$0.04 per image

## Option 3: OpenAI DALL-E

### Setup:
1. Get API key from https://platform.openai.com
2. Install SDK:
```bash
npm install openai
```

3. Update `server.js`:
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/generate-image', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    
    const imageUrl = response.data[0].url;
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    res.set('Content-Type', 'image/jpeg');
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Cost:** ~$0.04 per image (DALL-E 3)

## Recommendation

For this project, **Replicate with FLUX Schnell** is recommended because:
- Fast generation (~1-2 seconds)
- Low cost ($0.003 per image)
- High quality results
- Good style consistency
- Easy to integrate
