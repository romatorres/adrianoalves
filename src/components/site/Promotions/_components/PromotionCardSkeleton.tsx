export function PromotionCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full flex flex-col h-fit">
      <div className="relative w-full aspect-video bg-gray-200 animate-pulse"></div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="h-8 w-3/4 rounded bg-gray-200 animate-pulse mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse"></div>
          </div>
        </div>
        <div className="text-sm text-gray-03 mt-4">
          <div className="flex justify-between items-end">
            <div className="h-12 w-1/4 rounded bg-gray-200 animate-pulse"></div>
            <div className="h-12 w-1/3 rounded-full bg-gray-200 animate-pulse ml-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
