export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-busy="true" aria-label="Loading products">
      <div className="mb-8 space-y-2">
        <div className="h-9 w-52 bg-surface-700 rounded-lg animate-pulse" />
        <div className="h-4 w-32 bg-surface-700 rounded animate-pulse" />
      </div>

      <div className="flex gap-3 mb-6">
        <div className="h-10 flex-1 bg-surface-700 rounded-xl animate-pulse" />
        <div className="h-10 w-28 bg-surface-700 rounded-xl animate-pulse" />
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-60 shrink-0 space-y-6">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-surface-700 rounded animate-pulse" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 bg-surface-700 rounded animate-pulse" />
                <div className="h-4 w-20 bg-surface-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="border-t border-surface-600 pt-6 space-y-3">
            <div className="h-4 w-28 bg-surface-700 rounded animate-pulse" />
            <div className="h-4 w-full bg-surface-700 rounded-full animate-pulse" />
          </div>
        </aside>

        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="card overflow-hidden animate-pulse"
                style={{ animationDelay: `${i * 50}ms` }}
                aria-hidden="true"
              >
                <div className="aspect-square bg-surface-700" />
                <div className="p-4 space-y-2.5">
                  <div className="h-2.5 w-14 bg-surface-700 rounded-full" />
                  <div className="h-4 w-3/4 bg-surface-700 rounded" />
                  <div className="h-3 w-full bg-surface-700 rounded" />
                  <div className="h-3 w-2/3 bg-surface-700 rounded" />
                  <div className="h-5 w-20 bg-surface-700 rounded mt-3" />
                </div>
                <div className="px-4 pb-4">
                  <div className="h-9 bg-surface-700 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
