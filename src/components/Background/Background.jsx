import './Background.css'

export default function Background({ landmark }) {
  const image = landmark?.image || null

  return (
    <div className="background" aria-hidden="true">
      {image && (
        <div
          key={image}
          className="bg-landmark"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <div className="bg-overlay" />
    </div>
  )
}
