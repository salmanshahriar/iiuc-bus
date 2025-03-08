import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: string
  title: string
  message: string
  isRead: boolean
  createdAt?: string
}

interface NotificationDropdownProps {
  notifications: Notification[]
  loading: boolean
  markAsRead: (id: string) => Promise<void>
  onClose: () => void
}

export default function NotificationDropdown({
  notifications,
  loading,
  markAsRead,
  onClose,
}: NotificationDropdownProps) {
  console.log("Notifications in dropdown:", notifications) // Debug: Check what’s received

  const handleClick = async (id: string, isRead: boolean) => {
    if (!isRead) await markAsRead(id)
    onClose()
  }

  const formatTime = (dateString?: string) =>
    dateString ? formatDistanceToNow(new Date(dateString), { addSuffix: true }) : "Just now"

  const unreadNotifications = notifications.filter((n) => !n.isRead)
  const readNotifications = notifications.filter((n) => n.isRead)

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="p-4 pb-2 border-b">
        <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="p-0 max-h-[400px] overflow-auto">
        {loading ? (
          <div className="p-8 flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
        ) : (
          <>
            {unreadNotifications.length > 0 && (
              <>
                <div className="p-2 px-4 text-sm text-muted-foreground bg-muted">New</div>
                {unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleClick(notification.id, notification.isRead)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary  flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-black dark:text-white">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {readNotifications.length > 0 && (
              <>
                <div className="p-2 px-4 text-sm text-muted-foreground bg-muted">Older</div>
                {readNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleClick(notification.id, notification.isRead)}
                  >
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="font-medium text-sm text-gray-700">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}