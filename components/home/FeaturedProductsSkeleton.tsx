export default function FeaturedProductsSkeleton() {
  return (
    <section className="bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-slate-100 py-16 sm:py-20" aria-busy="true" aria-label="Loading products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-surface-600 rounded-full animate-pulse" />
            <div className="h-8 w-56 bg-surface-600 rounded-lg animate-pulse" />
          </div>
          <div className="hidden sm:block h-4 w-16 bg-surface-600 rounded animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border-2 border-slate-200 bg-white animate-pulse"
              style={{ animationDelay: `${i * 60}ms` }}
              aria-hidden="true"
            >
              <div className="aspect-square border-b-2 border-slate-200 bg-slate-100" />
              <div className="p-4 space-y-2.5">
                <div className="h-2.5 w-14 bg-slate-100 rounded-md" />
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
                <div className="h-5 w-24 bg-slate-100 rounded" />
              </div>
              <div className="border-t-2 border-slate-100 px-4 pb-4 pt-3">
                <div className="h-9 bg-slate-100 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
