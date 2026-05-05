import './StoryInput.css';

const artStyles = [
  { value: 'realistic', label: 'Realistic' },
  { value: 'manga', label: 'Manga' },
  { value: 'comic', label: 'Comic Book' },
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'illustration', label: 'Stylized Illustration' }
];

function StoryInput({ story, setStory, artStyle, setArtStyle, onGenerate, loading }) {
  return (
    <div className="story-input">
      <textarea
        className="story-textarea"
        placeholder="Enter your story, scene, or narrative here..."
        value={story}
        onChange={(e) => setStory(e.target.value)}
        disabled={loading}
      />
      
      <div className="controls">
        <div className="style-selector">
          <label>Art Style:</label>
          <select 
            value={artStyle} 
            onChange={(e) => setArtStyle(e.target.value)}
            disabled={loading}
          >
            {artStyles.map(style => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          className="generate-btn"
          onClick={onGenerate}
          disabled={loading || !story.trim()}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </div>
  );
}

export default StoryInput;
