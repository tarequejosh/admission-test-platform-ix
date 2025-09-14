"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Clock, User, FileText, CheckCircle, AlertTriangle, GraduationCap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StudentExamPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [studentInfo, setStudentInfo] = useState<any>(null)
  const [examQuestions, setExamQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("studentAuth")
    if (!auth) {
      router.push("/student/login")
      return
    }

    const student = JSON.parse(auth)
    setStudentInfo(student)

    const storedQuestions = localStorage.getItem("questions")
    let allQuestions = []

    if (storedQuestions) {
      allQuestions = JSON.parse(storedQuestions)
    }

    console.log("[v0] Student info:", student)
    console.log("[v0] All stored questions:", allQuestions)

    // Filter questions for the student's department and semester
    const departmentQuestions = allQuestions.filter((q: any) => {
      const matchesDepartment = q.department === student.department || q.department === "All"
      const matchesSemester = q.semester === student.semester
      console.log(
        "[v0] Question filter:",
        q.department,
        q.semester,
        "Student:",
        student.department,
        student.semester,
        "Matches:",
        matchesDepartment && matchesSemester,
      )
      return matchesDepartment && matchesSemester
    })

    console.log("[v0] Filtered questions:", departmentQuestions)

    // Randomize and limit to 25 questions
    const shuffled = [...departmentQuestions].sort(() => Math.random() - 0.5)
    const selectedQuestions = shuffled.slice(0, Math.min(25, shuffled.length))

    console.log("[v0] Final exam questions:", selectedQuestions)
    setExamQuestions(selectedQuestions)
    setLoading(false)
  }, [router])

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit()
    }
  }, [timeLeft, isSubmitted])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [examQuestions[currentQuestion].id]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    let score = 0
    examQuestions.forEach((question) => {
      const userAnswer = answers[question.id]
      if (userAnswer && userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
        score++
      }
    })

    const result = {
      studentSerial: studentInfo?.applicationSerial,
      studentName: studentInfo?.studentName || "Student",
      department: studentInfo?.department,
      semester: studentInfo?.semester,
      score,
      totalQuestions: examQuestions.length,
      percentage: Math.round((score / examQuestions.length) * 100),
      submittedAt: new Date().toISOString(),
      timeSpent: formatTime(3600 - timeLeft),
      answers,
      questions: examQuestions,
    }

    const existingResults = JSON.parse(localStorage.getItem("examResults") || "[]")
    existingResults.push(result)
    localStorage.setItem("examResults", JSON.stringify(existingResults))
    localStorage.setItem("examResult", JSON.stringify(result))

    router.push("/student/result")
  }

  const answeredQuestions = Object.keys(answers).length
  const progress = examQuestions.length > 0 ? (answeredQuestions / examQuestions.length) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <GraduationCap className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Loading Exam...</h2>
            <p className="text-gray-600">Preparing your personalized test</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!studentInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-600">Please log in to access the exam</p>
            <Button onClick={() => router.push("/student/login")} className="mt-4">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (examQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <FileText className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Questions Available</h2>
            <p className="text-gray-600 mb-4">
              No exam questions found for {studentInfo.department} - {studentInfo.semester}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Please contact your administrator to set up questions for your department and semester.
            </p>
            <Button onClick={() => router.push("/student/login")} variant="outline">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Exam Submitted!</h2>
            <p className="text-gray-600">Redirecting to results...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = examQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="font-semibold text-gray-900">DIU Admission Test</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{studentInfo.applicationSerial}</span>
                  <Badge variant="outline" className="text-xs">
                    {studentInfo.department} • {studentInfo.semester}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span>
                  Question {currentQuestion + 1} of {examQuestions.length}
                </span>
              </div>

              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  timeLeft < 600 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Answered</span>
                    <span>
                      {answeredQuestions}/{examQuestions.length}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {examQuestions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-8 h-8 rounded text-xs font-medium border ${
                        index === currentQuestion
                          ? "bg-blue-600 text-white border-blue-600"
                          : answers[examQuestions[index].id]
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {timeLeft < 600 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>Less than 10 minutes remaining!</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
                    <p className="text-sm text-blue-600 font-medium mt-1">{question.subject}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      question.type === "mcq" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {question.type === "mcq" ? "Multiple Choice" : "Fill in the Blank"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-lg leading-relaxed">{question.question}</div>

                {question.type === "mcq" ? (
                  <RadioGroup
                    value={answers[question.id] || ""}
                    onValueChange={handleAnswerChange}
                    className="space-y-3"
                  >
                    {question.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="fill-answer">Your Answer:</Label>
                    <Input
                      id="fill-answer"
                      value={answers[question.id] || ""}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="Type your answer here..."
                      className="text-lg"
                    />
                  </div>
                )}

                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                    Previous
                  </Button>

                  <div className="flex gap-3">
                    {currentQuestion === examQuestions.length - 1 ? (
                      <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                        Submit Exam
                      </Button>
                    ) : (
                      <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                        Next Question
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
