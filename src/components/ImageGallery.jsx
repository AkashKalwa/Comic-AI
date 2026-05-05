import './ImageGallery.css';

function ImageGallery({ images }) {
  return (
    <div className="image-gallery">
      <h2>Generated Story Sequence</h2>
      <div className="gallery-grid">
        {images.map((image, index) => (
          <div key={index} className="image-card">
            <div className="image-number">Scene {index + 1}</div>
            {image.url ? (
              <img src={image.url} alt={image.description} />
            ) : (
              <div className="image-error">
                <p>Failed to generate image</p>
                <small>{image.error}</small>
              </div>
            )}
            <p className="image-description">{image.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;
