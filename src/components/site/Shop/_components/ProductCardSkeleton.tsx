export function ProductCardSkeleton() {
  return (
    <div className="mx-auto flex h-full max-w-sm flex-col overflow-hidden rounded-lg bg-white shadow-lg">
      <div className="relative h-56 w-full bg-gray-200 animate-pulse"></div>
      <div className="flex flex-1 flex-col p-4">
        <div className="h-6 w-3/4 rounded bg-gray-200 animate-pulse mb-4"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div className="mt-4">
          <div className="h-4 w-1/4 rounded bg-gray-200 animate-pulse mb-2"></div>
          <div className="h-5 w-1/2 rounded bg-gray-200 animate-pulse"></div>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-1/3 rounded bg-gray-200 animate-pulse"></div>
          <div className="h-10 w-1/4 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
