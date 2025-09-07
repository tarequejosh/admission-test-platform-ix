"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Search, Download, Eye } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Mock student results data
const mockResults = [
  {
    id: 1,
    serialNumber: "DIU2024001",
    studentName: "Ahmed Hassan",
    department: "CSE",
    semester: "Fall 2024",
    score: 85,
    totalQuestions: 100,
    correctAnswers: 85,
    timeSpent: "58:30",
    examDate: "2024-03-15",
    status: "Completed",
    rank: 1,
  },
  {
    id: 2,
    serialNumber: "DIU2024002",
    studentName: "Fatima Rahman",
    department: "EEE",
    semester: "Fall 2024",
    score: 82,
    totalQuestions: 100,
    correctAnswers: 82,
    timeSpent: "59:45",
    examDate: "2024-03-15",
    status: "Completed",
    rank: 2,
  },
  {
    id: 3,
    serialNumber: "DIU2024003",
    studentName: "Mohammad Ali",
    department: "CSE",
    semester: "Fall 2024",
    score: 78,
    totalQuestions: 100,
    correctAnswers: 78,
    timeSpent: "60:00",
    examDate: "2024-03-15",
    status: "Completed",
    rank: 3,
  },
  {
    id: 4,
    serialNumber: "DIU2024004",
    studentName: "Rashida Begum",
    department: "Pharmacy",
    semester: "Fall 2024",
    score: 75,
    totalQuestions: 100,
    correctAnswers: 75,
    timeSpent: "57:20",
    examDate: "2024-03-15",
    status: "Completed",
    rank: 4,
  },
  {
    id: 5,
    serialNumber: "DIU2024005",
    studentName: "Karim Ahmed",
    department: "BBA",
    semester: "Fall 2024",
    score: 72,
    totalQuestions: 100,
    correctAnswers: 72,
    timeSpent: "59:10",
    examDate: "2024-03-15",
    status: "Completed",
    rank: 5,
  },
]

const departments = ["All", "CSE", "EEE", "Law", "Pharmacy", "NFE", "BBA", "English", "SWE"]
const semesters = ["All", "Spring 2024", "Summer 2024", "Fall 2024", "Spring 2025"]
const statuses = ["All", "Completed", "In Progress", "Not Started"]

// Chart data
const departmentStats = [
  { department: "CSE", students: 45, avgScore: 78.5 },
  { department: "EEE", students: 38, avgScore: 75.2 },
  { department: "Pharmacy", students: 32, avgScore: 73.8 },
  { department: "BBA", students: 28, avgScore: 71.4 },
  { department: "Law", students: 25, avgScore: 69.8 },
]

const scoreDistribution = [
  { range: "90-100", count: 12, color: "#22c55e" },
  { range: "80-89", count: 28, color: "#3b82f6" },
  { range: "70-79", count: 35, color: "#f59e0b" },
  { range: "60-69", count: 18, color: "#ef4444" },
  { range: "Below 60", count: 7, color: "#6b7280" },
]

export default function StudentResults() {
  const [results, setResults] = useState(mockResults)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("All")
  const [filterSemester, setFilterSemester] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")

  const filteredResults = results.filter((result) => {
    const matchesSearch =
      result.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === "All" || result.department === filterDepartment
    const matchesSemester = filterSemester === "All" || result.semester === filterSemester
    const matchesStatus = filterStatus === "All" || result.status === filterStatus
    return matchesSearch && matchesDepartment && matchesSemester && matchesStatus
  })

  // Sort by score (rank)
  const sortedResults = [...filteredResults].sort((a, b) => b.score - a.score)

  const handleExportResults = () => {
    const dataStr = JSON.stringify(sortedResults, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `results_${filterDepartment}_${filterSemester}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Student Results & Analytics</h2>
          <p className="text-gray-600">
            Monitor exam performance and generate reports • Total Students: {results.length}
          </p>
        </div>
        <Button onClick={handleExportResults}>
          <Download className="h-4 w-4 mr-2" />
          Export Results
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
            <p className="text-xs text-gray-600">Across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600">Overall performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.filter((r) => r.status === "Completed").length}</div>
            <p className="text-xs text-gray-600">Successfully finished</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((results.filter((r) => r.score >= 60).length / results.length) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600">Score ≥ 60%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Average scores by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Student performance ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ range, count }) => `${range}: ${count}`}
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Students</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name or serial..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={filterSemester} onValueChange={setFilterSemester}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterDepartment("All")
                  setFilterSemester("All")
                  setFilterStatus("All")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Results ({sortedResults.length})</CardTitle>
          <CardDescription>Sorted by score (highest to lowest)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Correct/Total</TableHead>
                <TableHead>Time Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedResults.map((result, index) => (
                <TableRow key={result.id}>
                  <TableCell>
                    <Badge variant={index < 3 ? "default" : "secondary"}>#{index + 1}</Badge>
                  </TableCell>
                  <TableCell className="font-mono">{result.serialNumber}</TableCell>
                  <TableCell className="font-medium">{result.studentName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{result.department}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{result.semester}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={result.score >= 80 ? "default" : result.score >= 60 ? "secondary" : "destructive"}>
                      {result.score}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {result.correctAnswers}/{result.totalQuestions}
                  </TableCell>
                  <TableCell className="font-mono">{result.timeSpent}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        result.status === "Completed"
                          ? "default"
                          : result.status === "In Progress"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {result.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
