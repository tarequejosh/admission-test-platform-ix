"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Search, Download, TrendingUp, Users, Award } from "lucide-react"

// Mock results data
const mockResults = [
  {
    id: 1,
    studentSerial: "DIU2024001",
    score: 85,
    totalQuestions: 100,
    percentage: 85,
    grade: "A+",
    submittedAt: "2024-01-15T10:30:00Z",
    department: "CSE",
    timeTaken: "55 minutes",
  },
  {
    id: 2,
    studentSerial: "DIU2024002",
    score: 72,
    totalQuestions: 100,
    percentage: 72,
    grade: "A",
    submittedAt: "2024-01-15T11:15:00Z",
    department: "EEE",
    timeTaken: "58 minutes",
  },
  {
    id: 3,
    studentSerial: "DIU2024003",
    score: 68,
    totalQuestions: 100,
    percentage: 68,
    grade: "B+",
    submittedAt: "2024-01-15T09:45:00Z",
    department: "BBA",
    timeTaken: "60 minutes",
  },
]

// Chart data
const scoreDistribution = [
  { range: "90-100", count: 12 },
  { range: "80-89", count: 25 },
  { range: "70-79", count: 30 },
  { range: "60-69", count: 18 },
  { range: "50-59", count: 8 },
  { range: "Below 50", count: 4 },
]

const departmentStats = [
  { department: "CSE", average: 78, students: 45 },
  { department: "EEE", average: 75, students: 38 },
  { department: "BBA", average: 72, students: 42 },
  { department: "Law", average: 70, students: 35 },
  { department: "Pharmacy", average: 74, students: 28 },
]

const gradeDistribution = [
  { grade: "A+", count: 15, color: "#10b981" },
  { grade: "A", count: 28, color: "#3b82f6" },
  { grade: "B+", count: 32, color: "#f59e0b" },
  { grade: "B", count: 18, color: "#ef4444" },
  { grade: "C", count: 12, color: "#6b7280" },
  { grade: "F", count: 8, color: "#dc2626" },
]

export default function ResultsDashboard() {
  const [results, setResults] = useState(mockResults)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterGrade, setFilterGrade] = useState("all")

  const filteredResults = results.filter((result) => {
    const matchesSearch = result.studentSerial.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || result.department === filterDepartment
    const matchesGrade = filterGrade === "all" || result.grade === filterGrade
    return matchesSearch && matchesDepartment && matchesGrade
  })

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      "A+": "bg-green-500",
      A: "bg-blue-500",
      "B+": "bg-yellow-500",
      B: "bg-orange-500",
      C: "bg-gray-500",
      F: "bg-red-500",
    }
    return colors[grade] || "bg-gray-500"
  }

  const exportResults = () => {
    // In a real app, this would generate and download a CSV/Excel file
    console.log("Exporting results...", filteredResults)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Results & Analytics</h2>
          <p className="text-gray-600">Monitor exam performance and generate reports</p>
        </div>
        <Button onClick={exportResults}>
          <Download className="h-4 w-4 mr-2" />
          Export Results
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">188</div>
            <p className="text-xs text-muted-foreground">Completed exams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">74.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last batch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.2%</div>
            <p className="text-xs text-muted-foreground">Above 50% threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43</div>
            <p className="text-xs text-muted-foreground">A+ and A grades</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Number of students by score range</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Percentage of students by grade</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ grade, count }) => `${grade}: ${count}`}
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Average scores and student count by department</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Average Score</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentStats.map((dept) => (
                <TableRow key={dept.department}>
                  <TableCell className="font-medium">{dept.department}</TableCell>
                  <TableCell>{dept.students}</TableCell>
                  <TableCell>{dept.average}%</TableCell>
                  <TableCell>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${dept.average}%` }}></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Results</CardTitle>
          <CardDescription>Search and filter student results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="search">Search Student</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by serial number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Filter by Department</Label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="EEE">EEE</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="Law">Law</SelectItem>
                  <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Filter by Grade</Label>
              <Select value={filterGrade} onValueChange={setFilterGrade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="F">F</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterDepartment("all")
                  setFilterGrade("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Serial</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Time Taken</TableHead>
                <TableHead>Submitted At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.studentSerial}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{result.department}</Badge>
                  </TableCell>
                  <TableCell>
                    {result.score}/{result.totalQuestions}
                  </TableCell>
                  <TableCell>{result.percentage}%</TableCell>
                  <TableCell>
                    <Badge className={`${getGradeColor(result.grade)} text-white`}>{result.grade}</Badge>
                  </TableCell>
                  <TableCell>{result.timeTaken}</TableCell>
                  <TableCell>{new Date(result.submittedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
