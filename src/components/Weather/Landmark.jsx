import './Landmark.css'

export default function Landmark({ landmark, loading }) {
  if (!landmark && !loading) return null

  return (
    <div className="landmark">
      {loading && (
        <div className="landmark-skeleton">
          <div className="skeleton-image shimmer" />
          <div className="skeleton-line shimmer" />
          <div className="skeleton-line short shimmer" />
        </div>
      )}

      {landmark && (
        <div className="landmark-card">
          {landmark.image && (
            <img
              className="landmark-image"
              src={landmark.image}
              alt={landmark.title}
              loading="lazy"
            />
          )}
          <div className="landmark-info">
            <span className="landmark-title">📍 {landmark.title}</span>
            {landmark.extract && (
              <p className="landmark-extract">{landmark.extract}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
