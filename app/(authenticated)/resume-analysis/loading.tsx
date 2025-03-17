export default function ResumeAnalysisLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="p-6 pb-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>

            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

