"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export function LostAndFound() {
  const [itemType, setItemType] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [contact, setContact] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!itemType) newErrors.itemType = "Item type is required"
    if (!description) newErrors.description = "Description is required"
    if (!location) newErrors.location = "Location is required"
    if (!contact) newErrors.contact = "Contact information is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Here you would typically send this data to your backend
      console.log({ itemType, description, location, contact })
      toast({
        title: "Report Submitted",
        description: "Your lost item report has been submitted successfully.",
      })
      // Reset form
      setItemType("")
      setDescription("")
      setLocation("")
      setContact("")
      setErrors({})
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lost & Found</CardTitle>
        
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="itemType">Item Type</Label>
              <Select value={itemType} onValueChange={setItemType}>
                <SelectTrigger id="itemType">
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="documents">Documents</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.itemType && <p className="text-sm text-[var(--primary-color)]">{errors.itemType}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the lost item"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && <p className="text-sm text-[var(--primary-color)]">{errors.description}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="location">Last Seen Location</Label>
              <Input
                id="location"
                placeholder="Where did you last see the item?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              {errors.location && <p className="text-sm text-[var(--primary-color)]">{errors.location}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="contact">Contact Information</Label>
              <Input
                id="contact"
                placeholder="Your email or phone number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              {errors.contact && <p className="text-sm text-[var(--primary-color)]">{errors.contact}</p>}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setItemType("")
            setDescription("")
            setLocation("")
            setContact("")
            setErrors({})
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Submit Report</Button>
      </CardFooter>
    </Card>
  )
}

