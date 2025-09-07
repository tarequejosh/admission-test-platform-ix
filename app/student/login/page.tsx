"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, ArrowLeft, User, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function StudentLoginPage() {
  const [applicationSerial, setApplicationSerial] = useState("")
  const [semesterPassword, setSemesterPassword] = useState("")
  const [department, setDepartment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const departments = [
    { value: "cse", label: "Computer Science & Engineering (CSE)" },
    { value: "eee", label: "Electrical & Electronic Engineering (EEE)" },
    { value: "law", label: "Law" },
    { value: "pharmacy", label: "Pharmacy" },
    { value: "nfe", label: "Nutrition & Food Engineering (NFE)" },
    { value: "bba", label: "Business Administration (BBA)" },
    { value: "english", label: "English" },
    { value: "swe", label: "Software Engineering (SWE)" },
    { value: "civil", label: "Civil Engineering" },
    { value: "textile", label: "Textile Engineering" },
    { value: "economics", label: "Economics" },
    { value: "sociology", label: "Sociology" },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (applicationSerial && semesterPassword && department) {
      setTimeout(() => {
        localStorage.setItem(
          "studentAuth",
          JSON.stringify({
            applicationSerial,
            department,
            loginTime: new Date().toISOString(),
          }),
        )
        router.push("/student/exam")
      }, 1000)
    } else {
      setError("Please fill in all fields including department selection")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-10 w-10 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Login</h1>
              <p className="text-sm text-gray-600">DIU Admission Portal</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Access Your Admission Test</CardTitle>
            <CardDescription>Enter your details and select your department to begin your examination</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={setDepartment} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationSerial">Application Serial Number</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="applicationSerial"
                    type="text"
                    placeholder="Enter your application serial"
                    value={applicationSerial}
                    onChange={(e) => setApplicationSerial(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semesterPassword">Semester Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="semesterPassword"
                    type="password"
                    placeholder="Enter semester password"
                    value={semesterPassword}
                    onChange={(e) => setSemesterPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Start Examination"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Important Instructions:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ensure stable internet connection</li>
                <li>• You have 60 minutes to complete the test</li>
                <li>• Test will auto-submit when time expires</li>
                <li>• Do not refresh or close the browser</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Demo Credentials (For Testing):</h4>
              <div className="text-sm text-green-700 space-y-1">
                <p>
                  <strong>Department:</strong> Select any department (e.g., CSE)
                </p>
                <p>
                  <strong>Application Serial:</strong> DIU2024001 (or any text)
                </p>
                <p>
                  <strong>Semester Password:</strong> spring2024 (or any text)
                </p>
                <p className="text-xs italic">Note: Any non-empty values will work for demo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
