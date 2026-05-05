from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torch
from diffusers import DiffusionPipeline
import io
from PIL import Image
import os

app = Flask(__name__)
CORS(app)

# Initialize Stable Diffusion XL Turbo (fast, no gating required)
print("Loading Stable Diffusion XL Turbo model...")
print("This may take a while on first run (downloading ~7GB)...")

# Use GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Load model with appropriate dtype based on device
if device == "cuda":
    pipe = DiffusionPipeline.from_pretrained(
        "stabilityai/sdxl-turbo",
        torch_dtype=torch.float16,
        variant="fp16"
    )
else:
    # CPU requires float32
    pipe = DiffusionPipeline.from_pretrained(
        "stabilityai/sdxl-turbo",
        torch_dtype=torch.float32
    )

pipe = pipe.to(device)

# Enable memory optimizations for GPU
if device == "cuda":
    pipe.enable_model_cpu_offload()
    
print(f"Model loaded successfully on {device}")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy", 
        "device": device,
        "model": "SDXL-Turbo"
    })

@app.route('/generate', methods=['POST'])
def generate_image():
    try:
        data = request.json
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        
        # Truncate prompt to 77 tokens (CLIP limit)
        if len(prompt) > 300:
            prompt = prompt[:300]
        
        print(f"Generating image for: {prompt[:100]}...")
        
        # Generate image with SDXL Turbo (optimized for speed)
        image = pipe(
            prompt,
            num_inference_steps=2,  # Reduced for CPU performance
            guidance_scale=0.0,  # Turbo works best with guidance_scale=0
            generator=torch.Generator(device).manual_seed(0)
        ).images[0]
        
        # Convert to bytes
        img_io = io.BytesIO()
        image.save(img_io, 'JPEG', quality=95)
        img_io.seek(0)
        
        print("Image generated successfully")
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
    if device == "cpu":
        print("⚠️  Running on CPU - generation will be slower (~15-30 seconds per image)")
    app.run(host='0.0.0.0', port=port, debug=False)
