"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { AlertCircle, Mic, MicOff, Send, Timer, Video, VideoOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import jobRolesData from "@/data/job-roles.json"
import questionsData from "@/data/questions.json"

interface JobRole {
  id: string
  title: string
  description: string
  skills: string[]
  level: string
  active: boolean
}

interface Question {
  id: string
  jobRoleId: string
  text: string
  difficulty: string
  timeLimit: number
  responseType: string
  active: boolean
}

interface Answer {
  questionId: string
  response: string
  score?: number
  feedback?: string
}

export default function InterviewSessionPage() {
  const params = useParams()
  const router = useRouter()
  const roleId = params.roleId as string

  const [jobRole, setJobRole] = useState<JobRole | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoRecording, setIsVideoRecording] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let mounted = true

    // In a real app, this would be an API call
    const fetchJobRoleAndQuestions = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (!mounted) return

        const role = (jobRolesData as JobRole[]).find((r) => r.id === roleId) || null
        const roleQuestions = (questionsData as Question[]).filter((q) => q.jobRoleId === roleId && q.active)

        setJobRole(role)
        setQuestions(roleQuestions)

        // Don't set timeLeft here, do it in the next useEffect
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchJobRoleAndQuestions()

    return () => {
      mounted = false
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
      }
    }
  }, [roleId])

  // Separate useEffect for setting timeLeft
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length && !isLoading) {
      setTimeLeft(questions[currentQuestionIndex].timeLimit)
      startTimer()
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentQuestionIndex, questions, isLoading])

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const toggleAudioRecording = async () => {
    if (isRecording) {
      setIsRecording(false)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
      }
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const audioChunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        // In a real app, you'd send this blob to your server or process it
        console.log("Audio recording complete", audioBlob)
        setCurrentAnswer("Audio response recorded")
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const toggleVideoRecording = async () => {
    if (isVideoRecording) {
      setIsVideoRecording(false)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
      }
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      const videoChunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        videoChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(videoChunks, { type: "video/webm" })
        // In a real app, you'd send this blob to your server or process it
        console.log("Video recording complete", videoBlob)
        setCurrentAnswer("Video response recorded")

        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())

        if (videoRef.current) {
          videoRef.current.srcObject = null
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsVideoRecording(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const submitAnswer = async () => {
    if (!currentAnswer.trim() && !isRecording && !isVideoRecording) {
      return
    }

    setIsSubmitting(true)

    try {
      // Stop any ongoing recordings
      if (isRecording || isVideoRecording) {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop()
        }
        setIsRecording(false)
        setIsVideoRecording(false)
      }

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      // In a real app, this would be an API call to process the answer with AI
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const currentQuestion = questions[currentQuestionIndex]
      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        response: currentAnswer,
      }

      // Store the answer without showing feedback
      setAnswers([...answers, newAnswer])

      // Move to the next question automatically
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setCurrentAnswer("")
      } else {
        // Interview complete, navigate to results page
        // In a real app, you'd save the interview results first
        router.push(`/interview/results/${roleId}`)
      }
    } catch (error) {
      console.error("Error submitting answer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-8"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        </div>
      </div>
    )
  }

  if (!jobRole || questions.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {!jobRole ? "Job role not found." : "No questions available for this job role."}
            Please try another role.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <a href="/job-roles">Return to Job Roles</a>
        </Button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{jobRole.title} Interview</h1>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="flex items-center">
            <Timer className="mr-1 h-4 w-4 text-amber-500" />
            <span className={`text-sm ${timeLeft < 30 ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
            <Badge
              variant={
                currentQuestion.difficulty === "easy"
                  ? "outline"
                  : currentQuestion.difficulty === "medium"
                    ? "secondary"
                    : "destructive"
              }
            >
              {currentQuestion.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{currentQuestion.text}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="text" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <Card>
            <CardContent className="pt-6">
              <Textarea
                placeholder="Type your answer here..."
                className="min-h-[200px]"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                disabled={isSubmitting}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={submitAnswer} disabled={!currentAnswer.trim() || isSubmitting}>
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />{" "}
                    {currentQuestionIndex < questions.length - 1 ? "Submit & Next" : "Submit & Finish"}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="audio">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
              {isRecording ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                    <div className="w-8 h-8 rounded-full bg-red-500 animate-pulse"></div>
                  </div>
                  <p className="text-lg font-medium mb-2">Recording...</p>
                  <p className="text-sm text-gray-500">Speak clearly and at a normal pace</p>
                </div>
              ) : (
                <p className="text-center text-gray-500 mb-4">Click the button below to start recording your answer</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant={isRecording ? "destructive" : "outline"}
                onClick={toggleAudioRecording}
                disabled={isSubmitting}
              >
                {isRecording ? (
                  <>
                    <MicOff className="mr-2 h-4 w-4" /> Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" /> Start Recording
                  </>
                )}
              </Button>
              <Button onClick={submitAnswer} disabled={(!isRecording && !currentAnswer) || isSubmitting}>
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />{" "}
                    {currentQuestionIndex < questions.length - 1 ? "Submit & Next" : "Submit & Finish"}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="video">
          <Card>
            <CardContent className="pt-6">
              <div className="relative min-h-[300px] bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden mb-4 flex items-center justify-center">
                {isVideoRecording ? (
                  <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                ) : (
                  <p className="text-center text-gray-500">Your video will appear here</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant={isVideoRecording ? "destructive" : "outline"}
                onClick={toggleVideoRecording}
                disabled={isSubmitting}
              >
                {isVideoRecording ? (
                  <>
                    <VideoOff className="mr-2 h-4 w-4" /> Stop Recording
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" /> Start Recording
                  </>
                )}
              </Button>
              <Button onClick={submitAnswer} disabled={(!isVideoRecording && !currentAnswer) || isSubmitting}>
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />{" "}
                    {currentQuestionIndex < questions.length - 1 ? "Submit & Next" : "Submit & Finish"}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

