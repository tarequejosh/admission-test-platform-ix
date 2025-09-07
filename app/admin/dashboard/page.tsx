"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Shield, FileText, Users, BarChart3, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import QuestionManagement from "@/components/admin/question-management"
import StudentResults from "@/components/admin/student-results"

export default function AdminDashboardPage() {
  const [adminInfo, setAdminInfo] = useState<any>(null)
  const [stats, setStats] = useState({
    totalQuestions: 0,
    activeExams: 0,
    studentsOnline: 0,
    completedExams: 0,
  })
  const router = useRouter()

  const calculateStats = () => {
    const questions = JSON.parse(localStorage.getItem("questions") || "[]")
    const candidates = JSON.parse(localStorage.getItem("candidates") || "[]")
    const examResults = JSON.parse(localStorage.getItem("examResults") || "[]")
    const activeExamSessions = JSON.parse(localStorage.getItem("activeExamSessions") || "[]")

    // Filter by department if not super admin
    const departmentFilter =
      adminInfo?.department && adminInfo.department !== "All Departments" ? adminInfo.department : null

    const filteredQuestions = departmentFilter
      ? questions.filter((q: any) => q.department === departmentFilter)
      : questions

    const filteredCandidates = departmentFilter
      ? candidates.filter((c: any) => c.department === departmentFilter)
      : candidates

    const filteredResults = departmentFilter
      ? examResults.filter((r: any) => r.department === departmentFilter)
      : examResults

    const filteredActiveSessions = departmentFilter
      ? activeExamSessions.filter((s: any) => s.department === departmentFilter)
      : activeExamSessions

    return {
      totalQuestions: filteredQuestions.length,
      activeExams: filteredActiveSessions.length,
      studentsOnline: filteredActiveSessions.filter((s: any) => s.status === "active").length,
      completedExams: filteredResults.length,
    }
  }

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (!auth) {
      router.push("/admin/login")
      return
    }
    setAdminInfo(JSON.parse(auth))
  }, [router])

  useEffect(() => {
    if (adminInfo) {
      setStats(calculateStats())

      // Update stats every 5 seconds for real-time data
      const interval = setInterval(() => {
        setStats(calculateStats())
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [adminInfo])

  if (!adminInfo) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-diu-green" />
              <div>
                <h1 className="font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">
                  DIU Admission Portal • {adminInfo.department || "All Departments"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline">
                {adminInfo.username} ({adminInfo.department || "Super Admin"})
              </Badge>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("adminAuth")
                  router.push("/")
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuestions}</div>
              <p className="text-xs text-muted-foreground">
                {adminInfo.department && adminInfo.department !== "All Departments"
                  ? `For ${adminInfo.department}`
                  : "Across all subjects"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeExams}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Online</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.studentsOnline}</div>
              <p className="text-xs text-muted-foreground">Taking exams now</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Exams</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedExams}</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions">Question Management</TabsTrigger>
            <TabsTrigger value="results">Results & Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="questions">
            <QuestionManagement />
          </TabsContent>

          <TabsContent value="results">
            <StudentResults />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
