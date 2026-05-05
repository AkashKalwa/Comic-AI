# Deployment Guide

## Option 1: Local Deployment (Recommended for Development)

### Requirements:
- NVIDIA GPU with 16GB+ VRAM (or 32GB+ RAM for CPU)
- Python 3.10+
- Node.js 18+

Follow the setup instructions in README.md

## Option 2: Cloud Deployment

### Backend Options:

#### A. Hugging Face Inference Endpoints (Easiest)
1. Go to https://ui.endpoints.huggingface.co/
2. Create a new endpoint with `black-forest-labs/FLUX.1-schnell`
3. Update frontend `.env`:
```
VITE_API_URL=https://your-endpoint.endpoints.huggingface.cloud
```

Cost: ~$0.60/hour (GPU instance)

#### B. Replicate (Pay-per-use)
1. Sign up at https://replicate.com
2. Use their FLUX.1-schnell API
3. Update `src/services/imageGenerator.js` to use Replicate SDK

Cost: ~$0.003 per image

#### C. AWS/GCP/Azure with GPU
1. Deploy Flask backend on GPU instance (g4dn.xlarge or similar)
2. Install CUDA and dependencies
3. Run Flask app with gunicorn
4. Set up load balancer and auto-scaling

Cost: ~$0.50-$2.00/hour depending on instance

### Frontend Deployment:

#### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

#### Netlify
```bash
npm run build
netlify deploy --prod
```

#### Static Hosting
```bash
npm run build
# Upload dist/ folder to any static host
```

## Option 3: Docker Deployment

Create `backend/Dockerfile`:
```dockerfile
FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04

RUN apt-get update && apt-get install -y python3.10 python3-pip

WORKDIR /app
COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY . .

CMD ["python3", "app.py"]
```

Build and run:
```bash
docker build -t story-to-image-backend ./backend
docker run --gpus all -p 5000:5000 story-to-image-backend
```

## Environment Variables

### Frontend (.env)
```
VITE_GEMINI_API_KEY=your_gemini_key
VITE_API_URL=your_backend_url
```

### Backend
```
PORT=5000
HF_TOKEN=your_huggingface_token  # Optional, for private models
```

## Performance Optimization

1. **Model Caching**: First run downloads ~20GB model, subsequent runs are instant
2. **Batch Processing**: Process multiple scenes in parallel if GPU memory allows
3. **CDN**: Use CDN for frontend assets
4. **Image Compression**: Compress generated images before sending to frontend
5. **Queue System**: Implement Redis queue for handling multiple concurrent requests

## Security Considerations

1. Add rate limiting to backend API
2. Implement authentication for production use
3. Validate and sanitize all user inputs
4. Use HTTPS for all communications
5. Set CORS policies appropriately
