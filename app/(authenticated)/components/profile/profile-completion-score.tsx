import { Progress } from "@/components/ui/progress"

interface ProfileField {
  name: string
  value: string | boolean | File | null
  weight: number
}

interface ProfileCompletionScoreProps {
  fields: ProfileField[]
  className?: string
}

export function ProfileCompletionScore({ fields, className }: ProfileCompletionScoreProps) {
  // Calculate completion percentage
  const totalWeight = fields.reduce((sum, field) => sum + field.weight, 0)
  const completedWeight = fields.reduce((sum, field) => {
    // Check if field is completed
    const isCompleted =
      (typeof field.value === "string" && field.value.trim() !== "") ||
      (typeof field.value === "boolean" && field.value) ||
      field.value instanceof File ||
      field.value !== null

    return sum + (isCompleted ? field.weight : 0)
  }, 0)

  const completionPercentage = Math.round((completedWeight / totalWeight) * 100)

  // Determine status color
  let statusColor = "bg-red-500"
  let statusText = "Incomplete"

  if (completionPercentage >= 80) {
    statusColor = "bg-green-500"
    statusText = "Excellent"
  } else if (completionPercentage >= 50) {
    statusColor = "bg-yellow-500"
    statusText = "Good Progress"
  } else if (completionPercentage >= 20) {
    statusColor = "bg-orange-500"
    statusText = "Getting Started"
  }

  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Profile Completion</h3>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${statusColor} mr-2`}></div>
          <span className="text-sm">{statusText}</span>
        </div>
      </div>

      <Progress value={completionPercentage} className="h-2 mb-2" />

      <div className="flex justify-between text-sm text-gray-500">
        <span>{completionPercentage}% complete</span>
        <span>
          {completedWeight}/{totalWeight} items
        </span>
      </div>
    </div>
  )
}

