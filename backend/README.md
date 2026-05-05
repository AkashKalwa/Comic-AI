# SDXL-Turbo Backend

This backend provides two options for AI image generation:

## Option 1: API Mode (Recommended - No Download)

Uses Hugging Face Inference API - no model download or GPU required!

### Setup:
```bash
pip install -r requirements.txt
python app_api.py
```

**Pros:**
- No model download (instant setup)
- No GPU required
- No disk space needed
- Always uses latest model

**Cons:**
- Requires internet connection
- May have rate limits
- First request takes ~20 seconds (model loading)

## Option 2: Local Mode (For Production)

Downloads and runs model locally - requires GPU.

### Setup:
```bash
pip install -r requirements_local.txt
python app.py
```

**Pros:**
- Faster after initial load
- No rate limits
- Works offline
- Full control

**Cons:**
- ~7GB download
- Requires GPU (8GB+ VRAM) or 16GB+ RAM
- Takes time to load initially

## API Endpoints

### POST /generate
Generate an image from a text prompt.

Request:
```json
{
  "prompt": "a beautiful sunset over mountains"
}
```

Response: JPEG image

### GET /health
Check server health.

## Performance

**API Mode:**
- First request: ~20 seconds (cold start)
- Subsequent: ~3-5 seconds

**Local Mode (GPU):**
- First load: ~30 seconds
- Generation: ~2-4 seconds per image

**Local Mode (CPU):**
- First load: ~60 seconds
- Generation: ~10-20 seconds per image
