from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
import io
import os

app = Flask(__name__)
CORS(app)

# Hugging Face API configuration
HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo"
HF_TOKEN = os.environ.get('HF_TOKEN')
if not HF_TOKEN:
    raise RuntimeError('HF_TOKEN environment variable is required')

headers = {
    "Authorization": f"Bearer {HF_TOKEN}"
}

print("Using Hugging Face Inference API (no model download required)")
print("Model: SDXL-Turbo")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy", 
        "mode": "API",
        "model": "SDXL-Turbo"
    })

@app.route('/generate', methods=['POST'])
def generate_image():
    try:
        data = request.json
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        
        print(f"Generating image via API for: {prompt[:100]}...")
        
        # Call Hugging Face Inference API
        payload = {
            "inputs": prompt,
            "parameters": {
                "num_inference_steps": 4,
                "guidance_scale": 0.0
            }
        }
        
        response = requests.post(HF_API_URL, headers=headers, json=payload)
        
        if response.status_code == 503:
            # Model is loading, retry after a delay
            return jsonify({
                "error": "Model is loading on Hugging Face servers. Please try again in 20 seconds."
            }), 503
        
        if not response.ok:
            error_text = response.text
            print(f"API Error: {error_text}")
            return jsonify({"error": f"API error: {error_text}"}), response.status_code
        
        # Return the image
        img_io = io.BytesIO(response.content)
        img_io.seek(0)
        
        print("Image generated successfully via API")
        return send_file(img_io, mimetype='image/jpeg')
        
    except Exception as e:
        print(f"Error generating image: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"\nServer starting on http://localhost:{port}")
    print("Ready to generate images via Hugging Face API!")
    print("No GPU or model download required!")
    app.run(host='0.0.0.0', port=port, debug=False)
