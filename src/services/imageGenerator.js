const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Generate unique session ID for character consistency
const sessionId = Date.now().toString();

export async function fetchAvailableModels() {
  try {
    const response = await fetch(`${API_URL}/models`);
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    const data = await response.json();
    return data.models;
  } catch (error) {
    console.error('Error fetching models:', error);
    // Return default models if API fails
    return [
      {
        id: "black-forest-labs/FLUX.1-dev",
        name: "FLUX.1 Dev",
        description: "High-quality generation"
      }
    ];
  }
}

async function generateSingleImage(prompt, model, sceneNumber, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          model,
          scene_number: sceneNumber,
          session_id: sessionId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (i < retries - 1) {
          console.log(`Retry ${i + 1}/${retries}...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        throw new Error(error.error || 'Image generation failed');
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

export async function generateImages(scenes, selectedModel, onProgress) {
  const images = [];
  
  for (let i = 0; i < scenes.length; i++) {
    onProgress(i + 1, scenes.length);
    
    const scene = scenes[i];
    
    try {
      const url = await generateSingleImage(scene.imagePrompt, selectedModel, scene.sceneNumber);
      
      images.push({
        url,
        description: scene.description,
        sceneNumber: scene.sceneNumber
      });
    } catch (error) {
      console.error(`Failed to generate image for scene ${i + 1}:`, error);
      // Continue with other scenes even if one fails
      images.push({
        url: null,
        description: scene.description,
        sceneNumber: scene.sceneNumber,
        error: error.message
      });
    }
    
    // Small delay between generations to avoid overwhelming the server
    if (i < scenes.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return images;
}
