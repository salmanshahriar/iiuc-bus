"use client"

import { motion } from "framer-motion"
import { Bus, Clock, MapPin, Users } from "lucide-react"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BusCardProps {
  bus: {
    busId: number
    busNo: string
    vehicleId: string
    capacity: number
    startPoint: string
    endPoint: string
    routeName: string
    scheduleDate: string
    scheduleTime: string
    busType: string
    additionalInfo?: string | null
  }
  gender: "Male" | "Female"
  occupancy: number
  className?: string
}

// Framer Motion animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  hover: { scale: 1.02 }
}

export function BusCard({ bus, gender, className }: BusCardProps) {
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
      <Card className={cn("overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg bg-card", className)}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-full">
                <Bus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Bus No: {bus.busNo}</h3>
                <p className="text-sm text-muted-foreground">{bus.busType}</p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs font-semibold px-3 py-1 rounded-full",
                gender === "Male" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
              )}
            >
              {gender}
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
              <p className="text-muted-foreground">{bus.routeName}</p>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
              <span>{bus.scheduleDate} at {bus.scheduleTime}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs font-medium">
                More Info
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bus Information</DialogTitle>
                <DialogDescription>Bus No: {bus.busNo}</DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <p><strong>Bus No:</strong> {bus.busNo}</p>
                <p><strong>Bus Type:</strong> {bus.busType}</p>
                <p><strong>Route:</strong> {bus.routeName}</p>
                <p><strong>Time:</strong> {bus.scheduleDate} at {bus.scheduleTime}</p>
                <p><strong>Gender:</strong> {gender}</p>
                {bus.additionalInfo && <p><strong>Additional Info:</strong> {bus.additionalInfo}</p>}
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium">
            <Link href={`/track?bus=${bus.busNo}`}>Live Track</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
