"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Clock, MapPin } from "lucide-react"
import { motion } from "framer-motion"

const FOUND_ITEMS = [
  {
    id: 1,
    type: "electronics",
    description: "Black Samsung phone",
    location: "Bus #123",
    foundDate: "2024-01-24",
    status: "unclaimed",
  },
  {
    id: 2,
    type: "accessories",
    description: "Blue backpack with IIUC logo",
    location: "Campus A Bus Stop",
    foundDate: "2024-01-23",
    status: "claimed",
  },
  {
    id: 3,
    type: "documents",
    description: "Student ID Card",
    location: "Bus #456",
    foundDate: "2024-01-24",
    status: "unclaimed",
  },
]

export function FoundItemsList() {
  return (
    <div className="space-y-4">
      {FOUND_ITEMS.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card 
            className={cn(
              "group relative bg-background/40 backdrop-blur-xl rounded-xl",
              "border border-border/50 hover:border-primary/20",
              "transition-all duration-300"
            )}
          >
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base group-hover:text-[var(--primary-color)] transition-colors duration-200">
                    {item.description}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <Clock className="h-3 w-3" />
                    Found on {item.foundDate}
                  </CardDescription>
                </div>
                <Badge 
                  variant={item.status === "unclaimed" ? "secondary" : "outline"}
                  className={cn(
                    "text-xs",
                    item.status === "unclaimed" 
                      ? "bg-[var(--primary-color)]/10 text-[var(--primary-color)] border-[var(--primary-color)]/20" 
                      : "group-hover:border-[var(--primary-color)]/20 group-hover:text-[var(--primary-color)]",
                    "transition-all duration-200"
                  )}
                >
                  {item.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize px-2 py-0.5 rounded-md bg-[var(--primary-color)]/5 text-[var(--primary-color)]">
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-[var(--primary-color)]" />
                    {item.location}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

