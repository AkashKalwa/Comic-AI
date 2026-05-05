from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io
import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Hugging Face API configuration
HF_TOKEN = os.environ.get('HF_TOKEN')

if not HF_TOKEN or HF_TOKEN == 'your_new_token_here':
    print("⚠️  WARNING: Please set your HF_TOKEN in backend/.env file")
    print("Get your token from: https://huggingface.co/settings/tokens")
    exit(1)

# Initialize Inference Clients for different providers
clients = {
    "hf-inference": InferenceClient(
        provider="hf-inference",
        api_key=HF_TOKEN
    ),
    "fal-ai": InferenceClient(
        provider="fal-ai",
        api_key=HF_TOKEN
    )
}

# Available models with their providers
AVAILABLE_MODELS = [
    {
        "id": "black-forest-labs/FLUX.1-dev",
        "name": "FLUX.1 Dev",
        "description": "Higher quality, slower (20+ steps)",
        "provider": "hf-inference"
    },
    {
        "id": "Tongyi-MAI/Z-Image-Turbo",
        "name": "Z-Image Turbo",
        "description": "Ultra-fast Chinese model",
        "provider": "fal-ai"
    },
    {
        "id": "stabilityai/stable-diffusion-xl-base-1.0",
        "name": "Stable Diffusion XL",
        "description": "Versatile, detailed images",
        "provider": "hf-inference"
    }
]

print("Using Hugging Face Inference Client API")
print(f"Available models: {len(AVAILABLE_MODELS)}")
print("No model download required!")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy", 
        "mode": "HF Inference Client",
        "available_models": len(AVAILABLE_MODELS)
    })

@app.route('/models', methods=['GET'])
def get_models():
    """Return list of available models"""
    return jsonify({"models": AVAILABLE_MODELS})

@app.route('/generate', methods=['POST'])
def generate_image():
    try:
        data = request.json
        prompt = data.get('prompt')
        model_id = data.get('model', 'black-forest-labs/FLUX.1-dev')
        scene_number = data.get('scene_number', 1)
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        
        # Find the model's provider
        model_info = next((m for m in AVAILABLE_MODELS if m['id'] == model_id), None)
        if not model_info:
            return jsonify({"error": f"Model {model_id} not found"}), 400
        
        provider = model_info['provider']
        client = clients[provider]
        
        # Enhanced prompt with emphasis on style and consistency
        enhanced_prompt = prompt
        
        # Add strong style emphasis at the beginning
        if 'manga' in prompt.lower():
            enhanced_prompt = f"MANGA STYLE, black and white manga art, Japanese comic book style, detailed ink linework, screentone shading, manga panel, {prompt}"
        elif 'comic' in prompt.lower():
            enhanced_prompt = f"COMIC BOOK STYLE, western comic art, bold outlines, vibrant colors, dynamic composition, {prompt}"
        elif 'cinematic' in prompt.lower():
            enhanced_prompt = f"CINEMATIC PHOTOGRAPHY, movie still, film grain, dramatic lighting, professional cinematography, {prompt}"
        elif 'illustration' in prompt.lower():
            enhanced_prompt = f"DIGITAL ILLUSTRATION, concept art style, detailed painting, artistic rendering, {prompt}"
        
        # Truncate if too long
        if len(enhanced_prompt) > 400:
            enhanced_prompt = enhanced_prompt[:400]
        
        print(f"Scene {scene_number} - Model: {model_id} (Provider: {provider})")
        print(f"Prompt: {enhanced_prompt[:150]}...")
        
        # Generate image using Inference Client with appropriate provider
        image = client.text_to_image(
            enhanced_prompt,
            model=model_id
        )
        
        # Convert PIL Image to bytes
        img_io = io.BytesIO()
        image.save(img_io, 'JPEG', quality=95)
        img_io.seek(0)
        
        print(f"✓ Scene {scene_number} generated successfully with {model_id}")
        return send_file(img_io, mimetype='image/jpeg')
        
    except Exception as e:
        print(f"Error generating image: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"\nServer starting on http://localhost:{port}")
    print("Ready to generate images!")
    app.run(host='0.0.0.0', port=port, debug=False)
