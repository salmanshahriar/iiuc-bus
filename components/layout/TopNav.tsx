"use client"

import { useState, useEffect, useCallback } from "react"
import { Bell, UserCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import NotificationDropdown from "./notification-dropdown"
import { ModeToggle } from "./ModeToggle"
import { ProfileSidebar } from "./ProfileSidebar"
import { useUser } from "@/contexts/UserContext"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  isRead: boolean
  createdAt?: string
}

export function TopNav() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const { user } = useUser()
  const token = user?.token // Adjust based on your UserContext

  // Local storage helpers
  const getReadNotifications = (): Notification[] => {
    const cached = localStorage.getItem("readNotifications")
    return cached ? JSON.parse(cached) : []
  }

  const getReadNotificationIds = (): Set<string> => {
    const cached = localStorage.getItem("readNotificationIds")
    return cached ? new Set(JSON.parse(cached)) : new Set<string>()
  }

  // Fetch unread notifications and combine with cached read ones
  const fetchNotifications = useCallback(async () => {
    const readIds = getReadNotificationIds()
    let readNotifications = getReadNotifications()

    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/notification`, {
        headers: {
          "Content-Type": "application/json",
          // ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`)
      }
      const result = await response.json()
      const unreadNotifications = Array.isArray(result.data)
        ? result.data.filter((n: Notification) => !readIds.has(n.id))
        : []

      const sortedRead = readNotifications
        .sort((a: Notification, b: Notification) =>
          new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
        )
        .slice(0, 10)
      const combinedNotifications = [...unreadNotifications, ...sortedRead]

      setNotifications(combinedNotifications)
      localStorage.setItem("notifications", JSON.stringify(combinedNotifications))
    } catch (error) {
      console.error("Fetch error:", error)
      setNotifications(readNotifications) // Fallback to cached read notifications
    } finally {
      setLoading(false)
    }
  }, [token])

  // Mark a notification as read
  const markAsRead = useCallback(
    async (id: string) => {
      try {
        const notificationToMark = notifications.find((n) => n.id === id)
        if (!notificationToMark || notificationToMark.isRead) return

        // Optimistic update
        setNotifications((prev) => {
          const updated = prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
          const unread = updated.filter((n) => !n.isRead)
          const read = updated
            .filter((n) => n.isRead)
            .sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime())
            .slice(0, 10)
          return [...unread, ...read]
        })
        
        // Send PATCH request
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/notification/${id}/mark-as-read`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // ...(token ? { "Authorization": `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ isRead: true }),
        })
        if (!response.ok) {
          throw new Error(`Failed to mark notification as read: ${response.status}`)
        }

        // Update local storage
        const readIds = getReadNotificationIds()
        readIds.add(id)
        localStorage.setItem("readNotificationIds", JSON.stringify([...readIds]))

        const cachedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]")
        const updatedNotification = cachedNotifications.find((n: Notification) => n.id === id)
        if (updatedNotification) {
          updatedNotification.isRead = true
          const allReadNotifications = [
            ...getReadNotifications().filter((n: Notification) => n.id !== id),
            updatedNotification,
          ]
          const sortedRead = allReadNotifications
            .sort((a: Notification, b: Notification) =>
              new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
            )
            .slice(0, 10)
          localStorage.setItem("readNotifications", JSON.stringify(sortedRead))
          const unread = cachedNotifications.filter((n: Notification) => !n.isRead)
          localStorage.setItem("notifications", JSON.stringify([...unread, ...sortedRead]))
        }
      } catch (error) {
        console.error("Mark as read error:", error)
        await fetchNotifications() // Sync with server on failure
      }
    },
    [notifications, token]
  )

  // Fetch on mount and poll every minute
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="fixed left-0 right-0 top-0 h-16 bg-background border-b border-border/50 z-50">
      <div className="flex items-center justify-between px-4 h-full mx-auto">
        <Link href="/" className="flex items-center">
          <img src="/icon-logo.png" alt="IIUC Logo" className="h-8 w-8 rounded-xl" />
          <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)]">
            IIUC<span className="text-primary">BUS</span>
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          {/* <ModeToggle /> */}
          <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-[var(--primary-color)]" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 px-1.5 py-0.5 text-xs text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <NotificationDropdown
                notifications={notifications}
                loading={loading}
                markAsRead={markAsRead}
                onClose={() => setIsNotificationOpen(false)}
              />
            </PopoverContent>
          </Popover>
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsProfileOpen(true)}
            className="relative"
          >
            <div
              className={cn(
                "absolute inset-0 rounded-full transition-all duration-300",
                isHovered ? "bg-primary/10 scale-125" : "scale-0"
              )}
            />
            <UserCircle className="h-8 w-8 text-[var(--primary-color)]" />
          </button>
        </div>
      </div>
      <ProfileSidebar isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  )
}