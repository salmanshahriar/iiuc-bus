"use client"

import { motion } from "framer-motion"
import { Bus, Clock, MapPin, Users, Phone, Calendar, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BusCardProps {
  bus: {
    busId: number
    busNo: number
    vehicleId: string
    capacity: number
    driverName: string
    driverPhone: string
    helperName: string
    helperPhone: string
    startPoint: string
    endPoint: string
    routeName: string
    scheduleDate: string
    scheduleTime: string
    busType: string
    gender: string | null
    additionalInfo: string | null
  }
  className?: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  hover: { scale: 1.02 },
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const formattedHour = hour % 12 || 12
  return `${formattedHour}:${minutes} ${ampm}`
}

export function BusCard({ bus, className }: BusCardProps) {
  const formattedTime = formatTime(bus.scheduleTime)

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
      <Card className={cn("overflow-hidden glass-effect card-hover-effect", className)}>
        {bus.gender && (
          <Badge
            variant="secondary"
            className={cn(
              "absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full",
              bus.gender.toLowerCase() === "male"
                ? "bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground"
                : "bg-secondary/40 text-foreground dark:bg-secondary dark:text-foreground"
            )}
          >
            <Users className="w-3 h-3 mr-1 inline-block" />
            {bus.gender}
          </Badge>
        )}

        <CardContent className="p-5">
          <div className="flex items-center mb-4">
            <div className="bg-primary/20 text-primary p-2 rounded-xl mr-3">
              <Bus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Bus {bus.busNo}</h3>
              <p className="text-sm font-medium text-primary">{bus.busType}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              {bus.routeName}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              {formattedTime}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              {bus.scheduleDate}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex justify-between gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs font-medium flex-1 border-primary/40 hover:bg-primary/10 text-foreground">
                More Info
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-effect">
              <DialogHeader>
                <DialogTitle className="text-foreground">Bus Information</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Details for Bus No: {bus.busNo}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Route Information</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Route:</strong> {bus.routeName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Start:</strong> {bus.startPoint}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>End:</strong> {bus.endPoint}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Date:</strong> {bus.scheduleDate}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Time:</strong> {formattedTime}
                  </p>
                </div>
                <Separator className="bg-border/50" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Vehicle Information</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Vehicle ID:</strong> {bus.vehicleId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Capacity:</strong> {bus.capacity}
                  </p>
                  {bus.gender && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Gender:</strong> {bus.gender}
                    </p>
                  )}
                </div>
                <Separator className="bg-border/50" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Staff Information</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">Driver</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Users className="h-3 w-3 mr-1 text-primary" /> {bus.driverName}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Phone className="h-3 w-3 mr-1 text-primary" /> {bus.driverPhone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Helper</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Users className="h-3 w-3 mr-1 text-primary" /> {bus.helperName}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Phone className="h-3 w-3 mr-1 text-primary" /> {bus.helperPhone}
                      </p>
                    </div>
                  </div>
                </div>
                {bus.additionalInfo && (
                  <>
                    <Separator className="bg-border/50" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Additional Info</h4>
                      <p className="text-sm text-muted-foreground flex items-start">
                        <Info className="h-4 w-4 mr-2 text-primary mt-0.5" /> {bus.additionalInfo}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            size="sm" 
            className="text-xs font-medium flex-1 bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] text-primary-foreground hover:brightness-110"
          >
            <Link href={`/track?bus=${bus.busNo}`} className="w-full">
              Live Track
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}