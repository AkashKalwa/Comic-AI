import './ModelSelector.css';

function ModelSelector({ models, selectedModel, setSelectedModel, disabled }) {
  return (
    <div className="model-selector">
      <h3>Select AI Model</h3>
      <div className="model-grid">
        {models.map((model) => (
          <div
            key={model.id}
            className={`model-card ${selectedModel === model.id ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={() => !disabled && setSelectedModel(model.id)}
          >
            <div className="model-name">{model.name}</div>
            <div className="model-description">{model.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModelSelector;
