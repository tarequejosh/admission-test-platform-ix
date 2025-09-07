"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search, Download } from "lucide-react"

const semesters = ["Spring 2024", "Summer 2024", "Fall 2024", "Spring 2025", "Summer 2025", "Fall 2025"]

export default function CandidateManagement({ userDepartment }: { userDepartment: string }) {
  const [candidates, setCandidates] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSemester, setFilterSemester] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState<any>(null)

  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    email: "",
    phone: "",
    semester: "",
    password: "",
  })

  useEffect(() => {
    const savedCandidates = localStorage.getItem("candidates")
    if (savedCandidates) {
      const allCandidates = JSON.parse(savedCandidates)
      const departmentCandidates = allCandidates.filter((c: any) => c.department === userDepartment)
      setCandidates(departmentCandidates)
    }
  }, [userDepartment])

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSemester = filterSemester === "all" || c.semester === filterSemester
    return matchesSearch && matchesSemester
  })

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let password = ""
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, password })
  }

  const handleAddCandidate = () => {
    const newCandidate = {
      id: Date.now(),
      ...formData,
      department: userDepartment,
      createdAt: new Date().toISOString().split("T")[0],
      examTaken: false,
      score: null,
    }

    const allCandidates = JSON.parse(localStorage.getItem("candidates") || "[]")
    allCandidates.push(newCandidate)
    localStorage.setItem("candidates", JSON.stringify(allCandidates))

    setCandidates([...candidates, newCandidate])
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditCandidate = (candidate: any) => {
    setEditingCandidate(candidate)
    setFormData({
      rollNumber: candidate.rollNumber,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      semester: candidate.semester,
      password: candidate.password,
    })
    setIsAddDialogOpen(true)
  }

  const handleUpdateCandidate = () => {
    const updatedCandidate = {
      ...editingCandidate,
      ...formData,
      department: userDepartment,
    }

    const allCandidates = JSON.parse(localStorage.getItem("candidates") || "[]")
    const updatedAllCandidates = allCandidates.map((c: any) => (c.id === editingCandidate.id ? updatedCandidate : c))
    localStorage.setItem("candidates", JSON.stringify(updatedAllCandidates))

    const updatedCandidates = candidates.map((c) => (c.id === editingCandidate.id ? updatedCandidate : c))
    setCandidates(updatedCandidates)
    resetForm()
    setIsAddDialogOpen(false)
    setEditingCandidate(null)
  }

  const handleDeleteCandidate = (id: number) => {
    const allCandidates = JSON.parse(localStorage.getItem("candidates") || "[]")
    const filteredAllCandidates = allCandidates.filter((c: any) => c.id !== id)
    localStorage.setItem("candidates", JSON.stringify(filteredAllCandidates))

    setCandidates(candidates.filter((c) => c.id !== id))
  }

  const resetForm = () => {
    setFormData({
      rollNumber: "",
      name: "",
      email: "",
      phone: "",
      semester: "",
      password: "",
    })
  }

  const handleExportCandidates = () => {
    const dataStr = JSON.stringify(filteredCandidates, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `candidates_${userDepartment}_${filterSemester}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Candidate Management - {userDepartment}</h2>
          <p className="text-gray-600">
            Manage student credentials and roll numbers • Total: {candidates.length} candidates
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCandidates}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm()
                  setEditingCandidate(null)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingCandidate ? "Edit Candidate" : "Add New Candidate"}</DialogTitle>
                <DialogDescription>
                  {editingCandidate
                    ? "Update the candidate details below."
                    : "Fill in the details to add a new candidate."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input
                      id="rollNumber"
                      placeholder="e.g., DIU2024001"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select
                      value={formData.semester}
                      onValueChange={(value) => setFormData({ ...formData, semester: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter candidate's full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="candidate@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+880 1234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Login Password</Label>
                  <div className="flex gap-2">
                    <Input
                      id="password"
                      placeholder="Enter or generate password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <Button type="button" variant="outline" onClick={generatePassword}>
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingCandidate ? handleUpdateCandidate : handleAddCandidate}>
                    {editingCandidate ? "Update Candidate" : "Add Candidate"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Candidates</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by roll number, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Filter by Semester</Label>
              <Select value={filterSemester} onValueChange={setFilterSemester}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
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
                  setFilterSemester("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Candidates ({filteredCandidates.length})</CardTitle>
          <CardDescription>Manage candidate credentials for {userDepartment} department</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <Badge variant="outline">{candidate.rollNumber}</Badge>
                  </TableCell>
                  <TableCell>{candidate.name}</TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>
                    <Badge variant="default">{candidate.semester}</Badge>
                  </TableCell>
                  <TableCell>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{candidate.password}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={candidate.examTaken ? "default" : "secondary"}>
                      {candidate.examTaken ? "Completed" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditCandidate(candidate)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteCandidate(candidate.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
