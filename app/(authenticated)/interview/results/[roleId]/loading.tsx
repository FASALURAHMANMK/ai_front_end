export default function InterviewResultsLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="flex justify-between items-end mb-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-start">
                      <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="animate-pulse mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
              <div className="space-y-4">
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

