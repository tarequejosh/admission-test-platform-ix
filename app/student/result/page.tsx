"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, User, Trophy, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function StudentResultPage() {
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const examResult = localStorage.getItem("examResult")
    const studentAuth = localStorage.getItem("studentAuth")

    if (!examResult || !studentAuth) {
      router.push("/student/login")
      return
    }

    setResult(JSON.parse(examResult))
  }, [router])

  if (!result) {
    return <div>Loading...</div>
  }

  const getGrade = (percentage: number) => {
    if (percentage >= 80) return { grade: "A+", color: "bg-green-500" }
    if (percentage >= 70) return { grade: "A", color: "bg-green-400" }
    if (percentage >= 60) return { grade: "B+", color: "bg-blue-500" }
    if (percentage >= 50) return { grade: "B", color: "bg-blue-400" }
    if (percentage >= 40) return { grade: "C", color: "bg-yellow-500" }
    return { grade: "F", color: "bg-red-500" }
  }

  const gradeInfo = getGrade(result.percentage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="font-semibold text-gray-900">Exam Results</h1>
                <p className="text-sm text-gray-600">DIU Admission Test</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Result Summary */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${gradeInfo.color} text-white text-2xl font-bold mb-4`}
          >
            {gradeInfo.grade}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Congratulations!</h2>
          <p className="text-xl text-gray-600">You have completed the DIU Admission Test</p>
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <CardTitle>Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {result.score}/{result.totalQuestions}
              </div>
              <p className="text-gray-600">Correct Answers</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Trophy className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <CardTitle>Percentage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{result.percentage}%</div>
              <p className="text-gray-600">Overall Performance</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Clock className="h-12 w-12 text-purple-500 mx-auto mb-2" />
              <CardTitle>Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-purple-600">
                {new Date(result.submittedAt).toLocaleString()}
              </div>
              <p className="text-gray-600">Completion Time</p>
            </CardContent>
          </Card>
        </div>

        {/* Student Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Application Serial</p>
                <p className="font-semibold">{result.studentSerial}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Grade</p>
                <Badge className={`${gradeInfo.color} text-white`}>{gradeInfo.grade}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Correct Answers</span>
                </div>
                <span className="text-green-600 font-bold">{result.score}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium">Incorrect Answers</span>
                </div>
                <span className="text-red-600 font-bold">{result.totalQuestions - result.score}</span>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your results have been recorded in the system</li>
                  <li>• Admission decisions will be communicated via email</li>
                  <li>• Keep your application serial number for future reference</li>
                  <li>• Contact admissions office for any queries</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
