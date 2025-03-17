export default function Loading() {
  return (
    <div className="container mx-auto p-6">
      <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 pb-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-1"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4 mb-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
                <div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 pb-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between items-center pb-2 border-b">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 pb-2">
              <div className="flex justify-between mb-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="flex gap-2 mb-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                ))}
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
            <div className="p-6 pt-2">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

