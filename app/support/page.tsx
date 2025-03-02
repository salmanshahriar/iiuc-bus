"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Phone, MessageCircle, Code, Send, User } from "lucide-react"

export default function SupportPage() {
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    universityId: "",
    department: "",
    userType: "",
    feedbackType: "Feedback",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFeedbackData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFeedbackData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      })

      if (response.ok) {
        alert("Feedback submitted successfully!")
        setFeedbackData({
          name: "",
          universityId: "",
          department: "",
          userType: "",
          feedbackType: "Feedback",
          message: "",
        })
      } else {
        alert("Failed to submit feedback. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("An error occurred. Please try again later.")
    }
  }

  return (
    <div className="container max-w-full mx-auto p-4 md:p-6 mb-20 md:mb-0">
      <div className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold text-[var(--primary-color)] flex items-center gap-2">
          <MessageCircle className="h-8 w-8" />
          Support
        </h1>
        <p className="text-muted-foreground mt-2">Contact information for emergency</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[var(--primary-color)] flex items-center gap-2">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                  Emergency Contacts
                </h2>
                <h3 className="text-sm font-medium text-muted-foreground mt-1">
                  International Islamic University Chittagong
                </h3>
                <p className="text-xs text-muted-foreground">Transport Management Division</p>
              </div>
            </div>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Field Supervisor", name: "Mohammed Jashim", phone: "01830161026" },
                { title: "Assistant Field Supervisor", name: "Kazi Habibur Rahman", phone: "01989110396" },
                { title: "Assistant Field Supervisor", name: "Mohammed Muzammel Hossain", phone: "01843689030" },
                { title: "Director", name: "Md Belal Uddin", phone: "01816-452588" },
                { title: "Assistant Director (Female)", name: "", phone: "01773229341" },
              ].map((contact, index) => (
                <div key={index} className="bg-muted p-2 rounded-md">
                  <h4 className="font-medium text-sm">{contact.title}</h4>
                  {contact.name && <p className="text-xs text-muted-foreground">{contact.name}</p>}
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-[var(--primary-color)] hover:underline text-sm flex items-center gap-1 mt-1"
                  >
                    <Phone className="h-3 w-3" /> {contact.phone}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[var(--primary-color)] flex items-center gap-2 mb-2 sm:mb-0">
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  Feedback
                </h2>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  We value your feedback. Let us know how we can improve our service.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto mt-2 sm:mt-0" size="lg">
                    <Send className="mr-2 h-4 w-4" /> Send Feedback
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[var(--primary-color)] flex items-center gap-2">
                      <MessageCircle className="h-6 w-6" />
                      Send Feedback
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={feedbackData.name}
                        onChange={handleInputChange}
                        className="col-span-3"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="universityId" className="text-right">
                        University ID
                      </Label>
                      <Input
                        id="universityId"
                        name="universityId"
                        value={feedbackData.universityId}
                        onChange={handleInputChange}
                        className="col-span-3"
                        placeholder="Your university ID"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="department" className="text-right">
                        Department
                      </Label>
                      <Select
                        name="department"
                        value={feedbackData.department}
                        onValueChange={(value) => handleSelectChange("department", value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "CSE",
                            "EEE",
                            "CE",
                            "CCE",
                            "ETE",
                            "BBA",
                            "QSIS",
                            "ELL",
                            "DHIS",
                            "DIS",
                            "EB",
                            "ALL",
                            "LAW",
                            "PHARMACY",
                            "Other",
                          ].map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="userType" className="text-right">
                        User Type
                      </Label>
                      <Select
                        name="userType"
                        value={feedbackData.userType}
                        onValueChange={(value) => handleSelectChange("userType", value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Student", "Teacher", "Staff", "Other"].map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="feedbackType" className="text-right">
                        Feedback Type
                      </Label>
                      <Select
                        name="feedbackType"
                        value={feedbackData.feedbackType}
                        onValueChange={(value) => handleSelectChange("feedbackType", value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select feedback type" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Complaint", "Suggestion", "Feedback", "Others"].map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="message" className="text-right mt-2">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={feedbackData.message}
                        onChange={handleInputChange}
                        className="col-span-3"
                        placeholder="Please provide your feedback here"
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSubmit} className="w-full">
                      Submit Feedback
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-sm text-muted-foreground mt-2 sm:hidden">
              We value your feedback. Let us know how we can improve our service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-[var(--primary-color)] mb-4 flex items-center gap-2">
              <Code className="h-5 w-5" />
              Developer Info
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { name: "Md. Saiful Chowdhury", role: "Project Lead/ Backend" },
                { name: "Salman Shahriar", role: "User Panel Frontend Lead" },
                { name: "Md. Shahed Alam", role: "Admin Panel Frontend Lead" },
                { name: "Towhidur Rahman Abid", role: "Admin Panel Frontend" },
                { name: "Sazidul Islam Hira", role: "Security" },
              ].map((dev, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-2 rounded-full border border-[var(--primary-color)] flex items-center justify-center bg-muted">
                    <User className="h-8 w-8 text-[var(--primary-color)]" />
                  </div>
                  <h3 className="text-sm font-medium">{dev.name}</h3>
                  <p className="text-xs text-muted-foreground">{dev.role}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-sm font-medium text-[var(--primary-color)] mb-2">Supported By:</h3>
              <p className="text-xs text-muted-foreground">Mohammed Hasan, Minhaz Uddin</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}