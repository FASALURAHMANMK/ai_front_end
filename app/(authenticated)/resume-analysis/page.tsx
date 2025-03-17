"use client"

import React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Upload, FileText, Award, Clock, Loader2, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function ResumeAnalysisPage() {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hasExistingResume, setHasExistingResume] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check for existing resume on component mount
  React.useEffect(() => {
    // In a real app, this would be an API call to check if the user has a resume
    const checkExistingResume = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setHasExistingResume(true) // Simulating that user has a resume
    }

    checkExistingResume()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    clearInterval(interval)
    setProgress(100)
    setIsUploading(false)

    toast({
      title: "Resume uploaded",
      description: "Your resume has been uploaded successfully.",
    })

    // Start analysis
    setIsAnalyzing(true)

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsAnalyzing(false)
    setAnalysisComplete(true)
  }

  const handleUseExistingResume = async () => {
    setIsAnalyzing(true)

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsAnalyzing(false)
    setAnalysisComplete(true)
  }

  const handleReset = () => {
    setFile(null)
    setIsUploading(false)
    setIsAnalyzing(false)
    setAnalysisComplete(false)
    setProgress(0)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Resume Analysis</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Upload your resume for AI-powered feedback and improvement suggestions
      </p>

      {!analysisComplete ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
            <CardDescription>Our AI will analyze your resume and provide personalized feedback</CardDescription>
          </CardHeader>
          <CardContent>
            {hasExistingResume && (
              <Alert className="mb-6">
                <FileText className="h-4 w-4" />
                <AlertTitle>You have an existing resume</AlertTitle>
                <AlertDescription className="flex items-center justify-between mt-2">
                  <span>You can use your existing resume or upload a new one.</span>
                  <Button onClick={handleUseExistingResume} disabled={isAnalyzing} size="sm">
                    {isAnalyzing ? "Analyzing..." : "Use Existing Resume"}
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center h-64 ${
                file ? "border-green-500" : "border-gray-300 dark:border-gray-600"
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-2">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mx-auto flex items-center justify-center">
                    <FileText className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium mb-1">Drag and drop your resume here</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Supports PDF, DOCX, TXT (max 5MB)</p>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Browse Files
                  </Button>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.txt"
                  />
                </>
              )}
            </div>

            {isUploading && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {isAnalyzing && (
              <div className="mt-4 flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Analyzing your resume...</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset} disabled={!file || isUploading || isAnalyzing}>
              Reset
            </Button>
            <Button onClick={handleUpload} disabled={!file || isUploading || isAnalyzing}>
              {isUploading ? "Uploading..." : isAnalyzing ? "Analyzing..." : "Analyze Resume"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Resume Analysis Results</CardTitle>
                <Badge className="bg-green-500">Score: 78/100</Badge>
              </div>
              <CardDescription>AI-powered feedback based on your resume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Overview</h3>
                  <p>
                    Your resume demonstrates solid technical skills and relevant work experience. With a few
                    improvements to formatting and content presentation, it could be even more effective.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Award className="h-5 w-5 text-amber-500 mr-2" />
                      <h4 className="font-medium">ATS Compatibility</h4>
                    </div>
                    <p className="text-sm">
                      Good ATS compatibility. Your resume should pass most automated screening systems.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Award className="h-5 w-5 text-amber-500 mr-2" />
                      <h4 className="font-medium">Keyword Relevance</h4>
                    </div>
                    <p className="text-sm">
                      Includes most relevant tech keywords, but could benefit from more industry-specific terms.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-amber-500 mr-2" />
                      <h4 className="font-medium">Reading Time</h4>
                    </div>
                    <p className="text-sm">Approximately 45 seconds. Good length for recruiters' initial screening.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="strengths" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="strengths">Strengths</TabsTrigger>
              <TabsTrigger value="improvements">Areas for Improvement</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="strengths">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Strengths</CardTitle>
                  <CardDescription>Positive aspects of your current resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Strong technical skills section</strong> - Clear presentation of relevant technologies
                        and tools.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Quantifiable achievements</strong> - Good use of metrics to demonstrate impact in
                        previous roles.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Concise work descriptions</strong> - Focused on relevant responsibilities and
                        achievements.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Education properly formatted</strong> - Clear presentation of degrees and relevant
                        coursework.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Contact information complete</strong> - All necessary contact details are included.
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="improvements">
              <Card>
                <CardHeader>
                  <CardTitle>Areas for Improvement</CardTitle>
                  <CardDescription>Aspects of your resume that could be enhanced</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <X className="mr-2 h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Professional summary missing</strong> - Consider adding a brief overview highlighting
                        your expertise.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <X className="mr-2 h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Formatting inconsistencies</strong> - Some sections have inconsistent spacing and bullet
                        styles.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <X className="mr-2 h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Skill levels not indicated</strong> - Consider specifying proficiency levels for
                        technical skills.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <X className="mr-2 h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Limited soft skills highlighted</strong> - Technical skills are well-represented, but
                        soft skills are minimal.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <X className="mr-2 h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Projects section lacking detail</strong> - Add more context about your role and
                        technologies used.
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Suggested changes to improve your resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4 list-decimal list-inside">
                    <li className="pl-2">
                      <span className="font-medium">Add a concise professional summary</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-6">
                        Include a 2-3 sentence summary highlighting your experience, key skills, and career goals.
                      </p>
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Standardize formatting throughout</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-6">
                        Use consistent font sizes, bullet styles, and spacing across all sections.
                      </p>
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Include skill proficiency levels</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-6">
                        Consider grouping skills by proficiency level (e.g., Expert, Advanced, Intermediate).
                      </p>
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Add relevant soft skills</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-6">
                        Include skills like problem-solving, team collaboration, and communication.
                      </p>
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Expand project descriptions</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-6">
                        For each project, clearly state your role, technologies used, and measurable outcomes.
                      </p>
                    </li>
                  </ol>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download Full Analysis Report
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              <Upload className="mr-2 h-4 w-4" /> Upload Another Resume
            </Button>
            <Button>Get Expert Resume Review</Button>
          </div>
        </>
      )}
    </div>
  )
}

