"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, User, Lock, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
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
    { value: "super", label: "Super Admin (All Departments)" },
  ]

  const demoCredentials = [
    { dept: "cse", username: "cse_admin", password: "cse123" },
    { dept: "eee", username: "eee_admin", password: "eee123" },
    { dept: "law", username: "law_admin", password: "law123" },
    { dept: "pharmacy", username: "pharmacy_admin", password: "pharmacy123" },
    { dept: "super", username: "super_admin", password: "super123" },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const validCredential = demoCredentials.find(
      (cred) => cred.username === username && cred.password === password && cred.dept === department,
    )

    if (validCredential || (username === "admin" && password === "admin123" && department === "super")) {
      setTimeout(() => {
        localStorage.setItem(
          "adminAuth",
          JSON.stringify({
            username,
            department,
            role: department === "super" ? "super_admin" : "department_admin",
            loginTime: new Date().toISOString(),
          }),
        )
        router.push("/admin/dashboard")
      }, 1000)
    } else {
      setError("Invalid credentials for the selected department")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-gray-700" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
              <p className="text-sm text-gray-600">DIU Admission Portal</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Administrator Access</CardTitle>
            <CardDescription>Login to manage questions and monitor exams for your department</CardDescription>
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
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-900" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Access Dashboard"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Demo Credentials:</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  <strong>CSE Admin:</strong> cse_admin / cse123
                </div>
                <div>
                  <strong>EEE Admin:</strong> eee_admin / eee123
                </div>
                <div>
                  <strong>Law Admin:</strong> law_admin / law123
                </div>
                <div>
                  <strong>Super Admin:</strong> super_admin / super123
                </div>
                <p className="text-xs italic mt-2">Each admin can only manage their department's questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
