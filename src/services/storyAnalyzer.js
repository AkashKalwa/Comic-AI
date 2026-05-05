import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzeStory(story, artStyle) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const prompt = `You are a story-to-image analyzer. Your job is to break down the user's story into sequential visual scenes.

CRITICAL RULES:
1. DO NOT create a new story - analyze the EXACT story provided by the user
2. Break the story into continuous sequential scenes based on the story's natural flow
3. Number of scenes should match the story length and complexity (3-8 scenes)
4. MAINTAIN STRICT CHARACTER CONSISTENCY - describe the SAME character appearance in EVERY scene
5. Each scene must have a detailed image generation prompt

User's Story:
${story}

Selected Art Style: ${artStyle}

IMPORTANT - Art Style Keywords:
- realistic: "photorealistic, detailed photography, cinematic lighting, 8k"
- manga: "manga art style, black and white manga, Japanese comic style, detailed linework, screentone shading"
- comic: "western comic book style, bold outlines, vibrant colors, dynamic composition, comic panel"
- cinematic: "cinematic shot, movie still, dramatic lighting, film grain, professional cinematography"
- illustration: "digital illustration, concept art, detailed painting, artistic style"

CHARACTER CONSISTENCY RULES:
- Define the main character's appearance in Scene 1 (age, hair color/style, clothing, distinctive features)
- Use the EXACT SAME character description in ALL subsequent scenes
- Only change the character's action/pose/expression, NOT their appearance

TASK: Break this story into sequential visual scenes. For each scene:
- Extract what's happening in that part of the story
- Use CONSISTENT character descriptions across all scenes
- Describe the setting, action, mood, and lighting
- Create a detailed image prompt that STARTS with the art style keywords

Return ONLY a JSON array:
[
  {
    "sceneNumber": 1,
    "description": "what happens in this scene from the story",
    "characters": "CONSISTENT character description: [age], [hair], [clothing], [features]",
    "setting": "environment and location",
    "mood": "emotional tone",
    "lighting": "lighting conditions",
    "action": "specific action happening",
    "imagePrompt": "${artStyle === 'manga' ? 'manga art style, black and white manga, Japanese comic style, detailed linework, screentone shading, ' : artStyle === 'comic' ? 'western comic book style, bold outlines, vibrant colors, dynamic composition, comic panel, ' : artStyle === 'cinematic' ? 'cinematic shot, movie still, dramatic lighting, film grain, professional cinematography, ' : artStyle === 'illustration' ? 'digital illustration, concept art, detailed painting, artistic style, ' : 'photorealistic, detailed photography, cinematic lighting, 8k, '}[CONSISTENT character description], [action], [setting], [mood], [lighting]"
  }
]

EXAMPLE for manga style:
{
  "sceneNumber": 1,
  "characters": "young boy, 10 years old, spiky black hair, wearing white t-shirt and blue shorts",
  "imagePrompt": "manga art style, black and white manga, Japanese comic style, detailed linework, screentone shading, young boy with spiky black hair wearing white t-shirt and blue shorts, running through park, dynamic motion lines, energetic expression, bright daylight"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Failed to parse story analysis');
  }
  
  const scenes = JSON.parse(jsonMatch[0]);
  
  // Ensure character consistency by extracting character description from first scene
  if (scenes.length > 0) {
    const mainCharacter = scenes[0].characters;
    
    // Apply the same character description to all scenes
    scenes.forEach((scene, index) => {
      if (index > 0) {
        scene.characters = mainCharacter;
        // Rebuild image prompt with consistent character
        const stylePrefix = artStyle === 'manga' 
          ? 'manga art style, black and white manga, Japanese comic style, detailed linework, screentone shading, '
          : artStyle === 'comic' 
          ? 'western comic book style, bold outlines, vibrant colors, dynamic composition, comic panel, '
          : artStyle === 'cinematic' 
          ? 'cinematic shot, movie still, dramatic lighting, film grain, professional cinematography, '
          : artStyle === 'illustration' 
          ? 'digital illustration, concept art, detailed painting, artistic style, '
          : 'photorealistic, detailed photography, cinematic lighting, 8k, ';
        
        scene.imagePrompt = `${stylePrefix}${mainCharacter}, ${scene.action}, ${scene.setting}, ${scene.mood}, ${scene.lighting}`;
      }
    });
  }
  
  // Add art style to each scene for image generation
  return scenes.map(scene => ({
    ...scene,
    artStyle: artStyle
  }));
}
