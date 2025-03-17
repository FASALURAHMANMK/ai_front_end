"use client"

import { useState, useEffect } from "react"
import { MultiStepDialog } from "@/components/ui/multi-step-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import questionPoolsData from "@/data/question-pools.json"
import questionsData from "@/data/updated-questions.json"

interface AddRoleDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddRole: (role: any) => void
}

interface QuestionPool {
  id: string
  name: string
  description: string
}

interface Question {
  id: string
  poolId: string
  text: string
  difficulty: string
  timeLimit: number
  responseTypes: string[]
  options: string[]
}

export function AddRoleDialog({ isOpen, onClose, onAddRole }: AddRoleDialogProps) {
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [level, setLevel] = useState("Mid-Level")
  const [active, setActive] = useState(true)
  const [skill, setSkill] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [questionCount, setQuestionCount] = useState(3)
  const [useAIGeneration, setUseAIGeneration] = useState(false)
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([])
  const [questionPools, setQuestionPools] = useState<QuestionPool[]>([])
  const [selectedPool, setSelectedPool] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // In a real app, these would be API calls
    setQuestionPools(questionPoolsData as QuestionPool[])
    setAvailableQuestions(questionsData as Question[])
  }, [])

  const filteredQuestions = availableQuestions.filter((question) => {
    const matchesPool = selectedPool === "all" || question.poolId === selectedPool
    const matchesSearch = question.text.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesPool && matchesSearch
  })

  const addSkill = () => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      setSkills([...skills, skill.trim()])
      setSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove))
  }

  const toggleQuestionSelection = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId))
    } else {
      setSelectedQuestions([...selectedQuestions, questionId])
    }
  }

  const handleComplete = () => {
    if (useAIGeneration && questionCount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please specify the number of questions to generate.",
        variant: "destructive",
      })
      return
    }

    if (!useAIGeneration && selectedQuestions.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one question or enable AI generation.",
        variant: "destructive",
      })
      return
    }

    const newRole = {
      id: `jr${Date.now()}`,
      title,
      description,
      skills,
      level,
      active,
      questionCount: useAIGeneration ? questionCount : selectedQuestions.length,
      selectedQuestions,
      useAIGeneration,
    }

    onAddRole(newRole)

    toast({
      title: "Job Role Created",
      description: `${title} has been added successfully.`,
    })

    // Reset form
    setTitle("")
    setDescription("")
    setLevel("Mid-Level")
    setActive(true)
    setSkills([])
    setQuestionCount(3)
    setUseAIGeneration(false)
    setSelectedQuestions([])
    setSelectedPool("all")
    setSearchQuery("")
  }

  return (
    <MultiStepDialog
      title="Add New Job Role"
      description="Create a new job role for interviews"
      isOpen={isOpen}
      onClose={onClose}
      onComplete={handleComplete}
      steps={["Basic Info", "Skills", "Questions", "Review"]}
    >
      {/* Step 1: Basic Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            placeholder="e.g. Frontend Developer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the responsibilities and requirements for this role"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Experience Level</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger id="level">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Entry-Level">Entry-Level</SelectItem>
              <SelectItem value="Mid-Level">Mid-Level</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="active" checked={active} onCheckedChange={setActive} />
          <Label htmlFor="active">Active</Label>
        </div>
      </div>

      {/* Step 2: Skills */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="skills">Required Skills</Label>
          <div className="flex space-x-2">
            <Input
              id="skills"
              placeholder="e.g. React"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addSkill()
                }
              }}
            />
            <Button type="button" onClick={addSkill} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Press Enter or click the plus button to add a skill</p>
        </div>

        <div className="mt-4">
          {skills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skills added yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <Badge key={s} variant="secondary" className="flex items-center gap-1">
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {s}</span>
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Step 3: Questions */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch id="ai-generation" checked={useAIGeneration} onCheckedChange={setUseAIGeneration} />
          <Label htmlFor="ai-generation">Generate questions with AI</Label>
        </div>

        {useAIGeneration ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question-count">Number of Questions</Label>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuestionCount(Math.max(1, questionCount - 1))}
                >
                  <span>-</span>
                </Button>
                <span className="text-xl font-medium w-8 text-center">{questionCount}</span>
                <Button type="button" variant="outline" size="icon" onClick={() => setQuestionCount(questionCount + 1)}>
                  <span>+</span>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                AI will generate {questionCount} questions based on the job role and skills
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Questions from Pool</Label>
              <div className="flex space-x-2">
                <Select value={selectedPool} onValueChange={setSelectedPool}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by pool" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pools</SelectItem>
                    {questionPools.map((pool) => (
                      <SelectItem key={pool.id} value={pool.id}>
                        {pool.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                {filteredQuestions.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No questions found</div>
                ) : (
                  <div className="divide-y">
                    {filteredQuestions.map((question) => (
                      <div key={question.id} className="p-3 hover:bg-muted/50">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={selectedQuestions.includes(question.id)}
                            onCheckedChange={() => toggleQuestionSelection(question.id)}
                            id={`question-${question.id}`}
                            className="mt-1"
                          />
                          <div className="space-y-1">
                            <Label htmlFor={`question-${question.id}`} className="font-medium cursor-pointer">
                              {question.text}
                            </Label>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <Badge
                                variant={
                                  question.difficulty === "easy"
                                    ? "outline"
                                    : question.difficulty === "medium"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {question.difficulty}
                              </Badge>
                              <Badge variant="outline">
                                {Math.floor(question.timeLimit / 60)}:
                                {(question.timeLimit % 60).toString().padStart(2, "0")}
                              </Badge>
                              {question.responseTypes.map((type) => (
                                <Badge key={type} variant="secondary">
                                  {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-muted/50 p-2 border-t">
                <div className="text-sm text-muted-foreground">{selectedQuestions.length} questions selected</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 4: Review */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Review Job Role</h3>
          <p className="text-sm text-muted-foreground">Please review the information before creating the job role.</p>
        </div>

        <div className="rounded-md border p-4 space-y-3">
          <div>
            <span className="font-medium">Title:</span> {title}
          </div>
          <div>
            <span className="font-medium">Description:</span> {description}
          </div>
          <div>
            <span className="font-medium">Level:</span> {level}
          </div>
          <div>
            <span className="font-medium">Status:</span>{" "}
            <Badge variant={active ? "default" : "secondary"} className={active ? "bg-green-500" : ""}>
              {active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Skills:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="font-medium">Questions:</span>{" "}
            {useAIGeneration ? (
              <span>AI will generate {questionCount} questions</span>
            ) : (
              <span>{selectedQuestions.length} questions selected</span>
            )}
          </div>
        </div>
      </div>
    </MultiStepDialog>
  )
}

