import './ImagePlaceholder.css'

function ImagePlaceholder({ width, height, alt, shape = 'rect' }) {
  return (
    <div
      className={`image-placeholder image-placeholder-${shape}`}
      style={{ aspectRatio: `${width} / ${height}` }}
      role="img"
      aria-label={alt}
    >
      <span>{alt}</span>
      <span className="image-placeholder-dims">
        {width}x{height}px
      </span>
    </div>
  )
}

export default ImagePlaceholder
