export default function JobDetailLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
              <div className="p-6 pb-3">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="flex gap-4 mb-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
              <div className="p-6 pb-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 pb-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="space-y-4">
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

