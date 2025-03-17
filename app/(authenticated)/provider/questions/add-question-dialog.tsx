"use client"

import { useState, useEffect } from "react"
import { MultiStepDialog } from "@/components/ui/multi-step-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import questionPoolsData from "@/data/question-pools.json"

interface QuestionPool {
  id: string
  name: string
  description: string
}

interface AddQuestionDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddQuestion: (question: any) => void
}

export function AddQuestionDialog({ isOpen, onClose, onAddQuestion }: AddQuestionDialogProps) {
  const { toast } = useToast()
  const [questionPools, setQuestionPools] = useState<QuestionPool[]>([])
  const [poolId, setPoolId] = useState("")
  const [newPoolName, setNewPoolName] = useState("")
  const [newPoolDescription, setNewPoolDescription] = useState("")
  const [isCreatingNewPool, setIsCreatingNewPool] = useState(false)
  const [text, setText] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [timeLimit, setTimeLimit] = useState(120)
  const [responseTypes, setResponseTypes] = useState<string[]>(["text"])
  const [options, setOptions] = useState<string[]>([])
  const [newOption, setNewOption] = useState("")

  useEffect(() => {
    // In a real app, this would be an API call
    setQuestionPools(questionPoolsData as QuestionPool[])
  }, [])

  const formatTimeLimit = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleResponseTypeChange = (type: string) => {
    if (responseTypes.includes(type)) {
      if (responseTypes.length > 1) {
        setResponseTypes(responseTypes.filter((t) => t !== type))
      }
    } else {
      setResponseTypes([...responseTypes, type])
    }
  }

  const addOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()])
      setNewOption("")
    }
  }

  const removeOption = (optionToRemove: string) => {
    setOptions(options.filter((o) => o !== optionToRemove))
  }

  const handleCreatePool = () => {
    if (!newPoolName.trim()) return

    const newPool = {
      id: `pool${Date.now()}`,
      name: newPoolName,
      description: newPoolDescription,
    }

    // In a real app, you would save this to the database
    setQuestionPools([...questionPools, newPool])
    setPoolId(newPool.id)
    setIsCreatingNewPool(false)
    setNewPoolName("")
    setNewPoolDescription("")

    toast({
      title: "Question Pool Created",
      description: `${newPoolName} has been created successfully.`,
    })
  }

  const handleComplete = () => {
    // Validate that at least one response type is selected
    if (responseTypes.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one response type.",
        variant: "destructive",
      })
      return
    }

    // If multiple choice is selected, ensure there are options
    if (responseTypes.includes("multiple-choice") && options.length < 2) {
      toast({
        title: "Validation Error",
        description: "Multiple choice questions require at least 2 options.",
        variant: "destructive",
      })
      return
    }

    const newQuestion = {
      id: `q${Date.now()}`,
      poolId,
      text,
      difficulty,
      timeLimit,
      responseTypes,
      options: responseTypes.includes("multiple-choice") ? options : [],
    }

    onAddQuestion(newQuestion)

    toast({
      title: "Question Created",
      description: "The interview question has been added successfully.",
    })

    // Reset form
    setPoolId("")
    setText("")
    setDifficulty("medium")
    setTimeLimit(120)
    setResponseTypes(["text"])
    setOptions([])
  }

  return (
    <MultiStepDialog
      title="Add New Question"
      description="Create a new interview question"
      isOpen={isOpen}
      onClose={onClose}
      onComplete={handleComplete}
      steps={["Question Pool", "Question Details", "Response Options", "Review"]}
    >
      {/* Step 1: Question Pool */}
      <div className="space-y-4">
        {!isCreatingNewPool ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="questionPool">Question Pool</Label>
              <Select value={poolId} onValueChange={setPoolId}>
                <SelectTrigger id="questionPool">
                  <SelectValue placeholder="Select question pool" />
                </SelectTrigger>
                <SelectContent>
                  {questionPools.map((pool) => (
                    <SelectItem key={pool.id} value={pool.id}>
                      {pool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="button" variant="outline" onClick={() => setIsCreatingNewPool(true)} className="w-full">
              Create New Pool
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="newPoolName">Pool Name</Label>
              <Input
                id="newPoolName"
                placeholder="e.g. Frontend Development"
                value={newPoolName}
                onChange={(e) => setNewPoolName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPoolDescription">Description</Label>
              <Textarea
                id="newPoolDescription"
                placeholder="Describe the question pool"
                value={newPoolDescription}
                onChange={(e) => setNewPoolDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsCreatingNewPool(false)} className="w-full">
                Cancel
              </Button>
              <Button type="button" onClick={handleCreatePool} className="w-full" disabled={!newPoolName.trim()}>
                Create Pool
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Step 2: Question Details */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="question">Question</Label>
          <Textarea
            id="question"
            placeholder="Enter the interview question"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="min-h-[120px]"
          />
        </div>
        <div className="space-y-2">
          <Label>Difficulty Level</Label>
          <RadioGroup value={difficulty} onValueChange={setDifficulty} className="flex space-x-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="easy" id="easy" />
              <Label htmlFor="easy" className="cursor-pointer">
                Easy
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="cursor-pointer">
                Medium
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hard" id="hard" />
              <Label htmlFor="hard" className="cursor-pointer">
                Hard
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Time Limit: {formatTimeLimit(timeLimit)}</Label>
          </div>
          <Slider value={[timeLimit]} min={30} max={300} step={30} onValueChange={(value) => setTimeLimit(value[0])} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>30s</span>
            <span>5m</span>
          </div>
        </div>
      </div>

      {/* Step 3: Response Options */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base">Response Types (Select at least one)</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="response-text"
                checked={responseTypes.includes("text")}
                onCheckedChange={() => handleResponseTypeChange("text")}
              />
              <Label htmlFor="response-text" className="cursor-pointer">
                Text
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="response-audio"
                checked={responseTypes.includes("audio")}
                onCheckedChange={() => handleResponseTypeChange("audio")}
              />
              <Label htmlFor="response-audio" className="cursor-pointer">
                Audio
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="response-video"
                checked={responseTypes.includes("video")}
                onCheckedChange={() => handleResponseTypeChange("video")}
              />
              <Label htmlFor="response-video" className="cursor-pointer">
                Video
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="response-multiple-choice"
                checked={responseTypes.includes("multiple-choice")}
                onCheckedChange={() => handleResponseTypeChange("multiple-choice")}
              />
              <Label htmlFor="response-multiple-choice" className="cursor-pointer">
                Multiple Choice
              </Label>
            </div>
          </div>
        </div>

        {responseTypes.includes("multiple-choice") && (
          <div className="space-y-4 border-t pt-4">
            <Label className="text-base">Multiple Choice Options</Label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add an option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addOption()
                    }
                  }}
                />
                <Button type="button" onClick={addOption} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Press Enter or click the plus button to add an option</p>
            </div>

            <div className="mt-4">
              {options.length === 0 ? (
                <p className="text-sm text-muted-foreground">No options added yet</p>
              ) : (
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border p-2">
                      <span>{option}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(option)}
                        className="h-6 w-6"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove option</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Step 4: Review */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Review Question</h3>
          <p className="text-sm text-muted-foreground">Please review the information before creating the question.</p>
        </div>

        <div className="rounded-md border p-4 space-y-3">
          <div>
            <span className="font-medium">Question Pool:</span>{" "}
            {questionPools.find((pool) => pool.id === poolId)?.name || "Not selected"}
          </div>
          <div>
            <span className="font-medium">Question:</span> {text}
          </div>
          <div>
            <span className="font-medium">Difficulty:</span>{" "}
            <Badge variant={difficulty === "easy" ? "outline" : difficulty === "medium" ? "secondary" : "destructive"}>
              {difficulty}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Time Limit:</span> {formatTimeLimit(timeLimit)}
          </div>
          <div>
            <span className="font-medium">Response Types:</span>{" "}
            <div className="flex flex-wrap gap-2 mt-2">
              {responseTypes.map((type) => (
                <Badge key={type} variant="secondary">
                  {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                </Badge>
              ))}
            </div>
          </div>
          {responseTypes.includes("multiple-choice") && options.length > 0 && (
            <div>
              <span className="font-medium">Multiple Choice Options:</span>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                {options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </MultiStepDialog>
  )
}

