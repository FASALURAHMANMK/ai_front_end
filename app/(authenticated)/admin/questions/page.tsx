"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BadgePlus, Clock, MoreHorizontal, Pencil, Trash2, FileDown } from "lucide-react"
import { AddQuestionDialog } from "./add-question-dialog"
import questionPoolsData from "@/data/question-pools.json"
import questionsData from "@/data/updated-questions.json"

interface Question {
  id: string
  poolId: string
  text: string
  difficulty: string
  timeLimit: number
  responseTypes: string[]
  options: string[]
}

interface QuestionPool {
  id: string
  name: string
  description: string
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionPools, setQuestionPools] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [poolFilter, setPoolFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        setQuestions(questionsData as Question[])

        // Create a map of pool IDs to names
        const poolMap = (questionPoolsData as QuestionPool[]).reduce(
          (acc, pool) => {
            acc[pool.id] = pool.name
            return acc
          },
          {} as Record<string, string>,
        )

        setQuestionPools(poolMap)
      } catch (error) {
        console.error("Error fetching questions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddQuestion = (newQuestion: Question) => {
    setQuestions([...questions, newQuestion])
  }

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.text.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = difficultyFilter === "all" || question.difficulty === difficultyFilter
    const matchesPool = poolFilter === "all" || question.poolId === poolFilter

    return matchesSearch && matchesDifficulty && matchesPool
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Question Pool</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage questions for interview pools</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button asChild variant="outline">
            <Link href="#">
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Link>
          </Button>
          <Button onClick={() => setIsAddQuestionOpen(true)}>
            <BadgePlus className="mr-2 h-4 w-4" />
            Add New Question
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Interview Questions</CardTitle>
          <CardDescription>{questions.length} questions available in pools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={poolFilter} onValueChange={setPoolFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by pool" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pools</SelectItem>
                {Object.entries(questionPools).map(([id, name]) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[45%]">Question</TableHead>
                    <TableHead>Pool</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Time Limit</TableHead>
                    <TableHead>Response Types</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No questions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuestions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-medium">
                          {question.text.length > 80 ? `${question.text.substring(0, 80)}...` : question.text}
                        </TableCell>
                        <TableCell>{questionPools[question.poolId] || "Unknown"}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell className="flex items-center">
                          <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                          {Math.floor(question.timeLimit / 60)}:{(question.timeLimit % 60).toString().padStart(2, "0")}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {question.responseTypes.slice(0, 2).map((type) => (
                              <Badge key={type} variant="secondary" className="text-xs">
                                {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                              </Badge>
                            ))}
                            {question.responseTypes.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{question.responseTypes.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/questions/${question.id}`}>View details</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/questions/${question.id}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => console.log(`Delete question: ${question.id}`)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddQuestionDialog
        isOpen={isAddQuestionOpen}
        onClose={() => setIsAddQuestionOpen(false)}
        onAddQuestion={handleAddQuestion}
      />
    </div>
  )
}

