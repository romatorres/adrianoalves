export function TeamCardSkeleton() {
  return (
    <div className="w-full mx-auto relative h-[440px] rounded-lg overflow-hidden bg-gray-200 animate-pulse">
      <div className="absolute bottom-0 left-0 right-0 py-3 px-4 bg-black/20">
        <div className="space-y-2">
          <div className="h-6 w-3/4 rounded bg-gray-300 animate-pulse"></div>
          <div className="h-4 w-1/2 rounded bg-gray-300 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
