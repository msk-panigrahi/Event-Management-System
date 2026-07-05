const SkeletonCard = () => (
  <div className="glass-card skeleton skeleton-card" />
);

export const SkeletonGrid = ({ count = 3 }) => (
  <div className="grid-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="glass-card" style={{ padding: 24 }}>
    <div className="skeleton skeleton-title" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton skeleton-text" style={{ width: `${70 + Math.random() * 30}%` }} />
    ))}
  </div>
);

export const SkeletonStats = ({ count = 4 }) => (
  <div className="grid-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="stat-card">
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 16 }} />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" style={{ width: '40%' }} />
      </div>
    ))}
  </div>
);

export default SkeletonCard;
