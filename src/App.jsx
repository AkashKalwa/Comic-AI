import { useState, useEffect } from 'react';
import StoryInput from './components/StoryInput';
import ImageGallery from './components/ImageGallery';
import ModelSelector from './components/ModelSelector';
import { analyzeStory } from './services/storyAnalyzer';
import { generateImages, fetchAvailableModels } from './services/imageGenerator';
import './App.css';

function App() {
  const [story, setStory] = useState('');
  const [artStyle, setArtStyle] = useState('realistic');
  const [selectedModel, setSelectedModel] = useState('black-forest-labs/FLUX.1-dev');
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [images, setImages] = useState([]);

  // Fetch available models on mount
  useEffect(() => {
    fetchAvailableModels().then(models => {
      setAvailableModels(models);
    }).catch(err => {
      console.error('Failed to fetch models:', err);
    });
  }, []);

  const handleGenerate = async () => {
    if (!story.trim()) return;
    
    setLoading(true);
    setImages([]);
    
    try {
      setProgress('Analyzing story...');
      const scenes = await analyzeStory(story, artStyle);
      
      setProgress(`Generating ${scenes.length} images with ${selectedModel}...`);
      const generatedImages = await generateImages(scenes, selectedModel, (current, total) => {
        setProgress(`Generating image ${current} of ${total}...`);
      });
      
      setImages(generatedImages);
      setProgress('');
    } catch (error) {
      console.error('Generation error:', error);
      setProgress(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Story to Image Generator</h1>
        <p>Transform your narrative into visual storytelling with AI</p>
      </header>
      
      <main className="main">
        <StoryInput
          story={story}
          setStory={setStory}
          artStyle={artStyle}
          setArtStyle={setArtStyle}
          onGenerate={handleGenerate}
          loading={loading}
        />
        
        <ModelSelector
          models={availableModels}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          disabled={loading}
        />
        
        {progress && (
          <div className="progress">
            {progress}
          </div>
        )}
        
        {images.length > 0 && <ImageGallery images={images} />}
      </main>
    </div>
  );
}

export default App;
