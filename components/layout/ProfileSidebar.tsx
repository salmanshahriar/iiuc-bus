"use client"

import React from "react"
import { X, LogOut } from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"

interface ProfileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const { language, setLanguage, busType, setBusType, translate } = useUser()

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full md:w-72 bg-background border-l transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-[99999]`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">{translate("profile")}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">User Name</p>
            <p className="text-sm text-muted-foreground">{translate("email")}: user@gmail.com</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="language-toggle">{translate("language")}</Label>
            <div className="flex items-center space-x-2">
              <span className={language === "en" ? "font-medium" : "text-muted-foreground"}>En</span>
              <Switch
                id="language-toggle"
                checked={language === "bn"}
                onCheckedChange={(checked) => setLanguage(checked ? "bn" : "en")}
              />
              <span className={language === "bn" ? "font-medium" : "text-muted-foreground"}>Bn</span>
            </div>
          </div>
          <Button variant="destructive" className="w-full mt-20" onClick={() => console.log("Logout clicked")}>
            <LogOut className="mr-2 h-4 w-4" /> {translate("logout")}
          </Button>

        </div>

       
      </div>
    </div>
  )
}

