export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 page-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="skeleton h-64 rounded-xl" />
        ))}
      </div>
      <div className="skeleton h-80 rounded-xl" />
    </div>
  );
}
