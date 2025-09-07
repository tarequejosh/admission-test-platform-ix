"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

const departments = ["CSE", "EEE", "Law", "Pharmacy", "NFE", "BBA", "English", "SWE"]
const subjects = ["Physics", "Chemistry", "Biology", "Mathematics", "English", "General Knowledge"]
const difficulties = ["Easy", "Medium", "Hard"]
const semesters = ["Spring 2024", "Summer 2024", "Fall 2024", "Spring 2025", "Summer 2025", "Fall 2025"]

export default function QuestionManagement({ userDepartment }: { userDepartment: string }) {
  const [questions, setQuestions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSubject, setFilterSubject] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterSemester, setFilterSemester] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<any>(null)

  const [formData, setFormData] = useState({
    subject: "",
    type: "mcq",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    difficulty: "Easy",
    department: userDepartment,
    semester: "",
  })

  useEffect(() => {
    const savedQuestions = localStorage.getItem("questions")
    if (savedQuestions) {
      const allQuestions = JSON.parse(savedQuestions)
      const departmentQuestions = allQuestions.filter((q: any) => q.department === userDepartment)
      setQuestions(departmentQuestions)
    }
  }, [userDepartment])

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = filterSubject === "all" || q.subject === filterSubject
    const matchesSemester = filterSemester === "all" || q.semester === filterSemester
    return matchesSearch && matchesSubject && matchesSemester
  })

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      ...formData,
      department: userDepartment,
      options: formData.type === "mcq" ? formData.options.filter((opt) => opt.trim()) : undefined,
      createdAt: new Date().toISOString().split("T")[0],
    }

    const allQuestions = JSON.parse(localStorage.getItem("questions") || "[]")
    allQuestions.push(newQuestion)
    localStorage.setItem("questions", JSON.stringify(allQuestions))

    setQuestions([...questions, newQuestion])
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question)
    setFormData({
      subject: question.subject,
      type: question.type,
      question: question.question,
      options: question.options || ["", "", "", ""],
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      department: userDepartment,
      semester: question.semester,
    })
    setIsAddDialogOpen(true)
  }

  const handleUpdateQuestion = () => {
    const updatedQuestion = {
      ...editingQuestion,
      ...formData,
      department: userDepartment,
      options: formData.type === "mcq" ? formData.options.filter((opt) => opt.trim()) : undefined,
    }

    const allQuestions = JSON.parse(localStorage.getItem("questions") || "[]")
    const updatedAllQuestions = allQuestions.map((q: any) => (q.id === editingQuestion.id ? updatedQuestion : q))
    localStorage.setItem("questions", JSON.stringify(updatedAllQuestions))

    const updatedQuestions = questions.map((q) => (q.id === editingQuestion.id ? updatedQuestion : q))
    setQuestions(updatedQuestions)
    resetForm()
    setIsAddDialogOpen(false)
    setEditingQuestion(null)
  }

  const handleDeleteQuestion = (id: number) => {
    const allQuestions = JSON.parse(localStorage.getItem("questions") || "[]")
    const filteredAllQuestions = allQuestions.filter((q: any) => q.id !== id)
    localStorage.setItem("questions", JSON.stringify(filteredAllQuestions))

    setQuestions(questions.filter((q) => q.id !== id))
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const handleExportQuestions = () => {
    const dataStr = JSON.stringify(filteredQuestions, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `questions_${userDepartment}_${filterSemester}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const resetForm = () => {
    setFormData({
      subject: "",
      type: "mcq",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      difficulty: "Easy",
      department: userDepartment,
      semester: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Question Bank Management - {userDepartment}</h2>
          <p className="text-gray-600">
            Manage questions for {userDepartment} department • Total: {questions.length} questions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportQuestions}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm()
                  setEditingQuestion(null)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
                <DialogDescription>
                  {editingQuestion
                    ? "Update the question details below."
                    : "Fill in the details to add a new question to the bank."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
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

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mcq" id="mcq" />
                        <Label htmlFor="mcq">Multiple Choice</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fill" id="fill" />
                        <Label htmlFor="fill">Fill in the Blank</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((diff) => (
                          <SelectItem key={diff} value={diff}>
                            {diff}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter the question text..."
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    rows={3}
                  />
                </div>

                {formData.type === "mcq" && (
                  <div className="space-y-2">
                    <Label>Answer Options</Label>
                    {formData.options.map((option, index) => (
                      <Input
                        key={index}
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                      />
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="correctAnswer">Correct Answer</Label>
                  {formData.type === "mcq" ? (
                    <Select
                      value={formData.correctAnswer}
                      onValueChange={(value) => setFormData({ ...formData, correctAnswer: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.options
                          .filter((opt) => opt.trim())
                          .map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="correctAnswer"
                      placeholder="Enter the correct answer..."
                      value={formData.correctAnswer}
                      onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                    />
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingQuestion ? handleUpdateQuestion : handleAddQuestion}>
                    {editingQuestion ? "Update Question" : "Add Question"}
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
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Questions</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by question or subject..."
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

            <div className="space-y-2">
              <Label>Filter by Subject</Label>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
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
                  setFilterSubject("all")
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
          <CardTitle>Questions ({filteredQuestions.length})</CardTitle>
          <CardDescription>
            Manage and organize questions for {userDepartment} department admission test
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="max-w-md">
                    <div className="truncate">{question.question}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{question.subject}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{question.semester}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={question.type === "mcq" ? "default" : "destructive"}>
                      {question.type === "mcq" ? "MCQ" : "Fill"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        question.difficulty === "Easy"
                          ? "secondary"
                          : question.difficulty === "Medium"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditQuestion(question)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
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
