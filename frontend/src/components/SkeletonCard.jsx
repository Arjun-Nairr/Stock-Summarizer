export default function SkeletonCard() {
  return (
    <div className="card skeleton-card">
      <div className="card-header">
        <div className="card-header-left">
          <div className="sk sk-avatar" />
          <div>
            <div className="sk sk-name" />
            <div className="sk sk-ticker" />
          </div>
        </div>
        <div className="sk sk-badge" />
      </div>
      <div className="sk sk-price" />
      <div className="sk sk-line" />
      <div className="sk sk-line sk-line-short" />
      <div className="sk sk-line" />
    </div>
  );
}
