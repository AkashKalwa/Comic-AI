# Story to Image Generator

Transform narratives into visual storytelling with AI-powered image generation.

# Story to Image Generator - Generative AI

A full-stack generative AI application that converts stories into sequential AI-generated images using:
- **Gemini 2.5 Flash** for story analysis and scene breakdown
- **Stable Diffusion XL Turbo** (Hugging Face) for high-quality, fast image generation

## Architecture

### Frontend (React + Vite)
- Story input and art style selection
- Real-time progress tracking
- Image gallery display

### Backend (Python + Flask)
- SDXL-Turbo model inference
- GPU-accelerated image generation (or CPU fallback)
- RESTful API

## Setup

### Backend Setup (API Mode - No Download Required!)

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Install dependencies (lightweight):
```bash
pip install -r requirements.txt
```

4. Start the backend:
```bash
python app_api.py
```

Backend will run on http://localhost:5000

**Note:** First image generation takes ~20 seconds as the model loads on HF servers. Subsequent generations are faster.

### Alternative: Local Mode (Requires GPU)

If you want to run the model locally:
```bash
pip install -r requirements_local.txt
python app.py
```

This downloads ~7GB model but runs faster after initial load.

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the frontend:
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## Usage

1. Enter your story or scene in the text area
2. Select an art style (realistic, manga, comic, cinematic, illustration)
3. Click "Generate"
4. Wait for AI to analyze your story and generate sequential images

## Features

- **Story Analysis**: Gemini AI breaks down your story into sequential scenes
- **Scene Breakdown**: Identifies characters, settings, actions, and moods
- **Prompt Generation**: Creates detailed prompts for each scene
- **Image Generation**: SDXL-Turbo generates high-quality images in ~2-4 seconds
- **Style Consistency**: Maintains character and visual consistency across scenes
- **Multiple Art Styles**: Realistic, manga, comic, cinematic, illustration

## System Requirements

### Minimum (CPU):
- 16GB RAM
- ~10-20 seconds per image

### Recommended (GPU):
- NVIDIA GPU with 8GB+ VRAM (RTX 3060, 3070, 4060, etc.)
- ~2-4 seconds per image

## Model Information

**Stable Diffusion XL Turbo**
- Developer: Stability AI
- Parameters: 3.5 billion
- Inference Steps: 1-4 (optimized for speed)
- License: Open source
- Quality: High-quality, fast generation

## Usage

1. Enter your story or scene in the text area
2. Select an art style (realistic, manga, comic, cinematic, or illustration)
3. Click Generate
4. Wait for the AI to analyze and generate sequential images

## Features

- **Generative AI Story Analysis**: Gemini 2.5 Flash analyzes YOUR story
- **Scene Breakdown**: Breaks story into sequential visual scenes
- **AI Image Generation**: FLUX.1-schnell from Hugging Face
- **Character Consistency**: Maintains consistent character appearance
- **Multiple Art Styles**: Realistic, manga, comic, cinematic, illustration
- **High Quality**: State-of-the-art 12B parameter diffusion model
- Multiple art style options
- Sequential visual storytelling
- Clean, modern interface
