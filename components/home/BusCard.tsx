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
      <Card className={cn("overflow-hidden hover:shadow-lg bg-card relative", className)}>
        {bus.gender && (
          <Badge
            variant="secondary"
            className={cn(
              "absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full",
              bus.gender.toLowerCase() === "male"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
            )}
          >
            <Users className="w-3 h-3 mr-1 inline-block" />
            {bus.gender}
          </Badge>
        )}

        <CardContent className="p-4">
          <div className="flex items-center mb-4">
            <div className="bg-primary/10 text-primary p-2 rounded-xl mr-3">
              <Bus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Bus {bus.busNo}</h3>
              <p className="text-sm font-medium text-primary">{bus.busType}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
              {bus.routeName}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
              {formattedTime}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
              {bus.scheduleDate}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs font-medium flex-1">
                More Info
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Bus Information</DialogTitle>
                <DialogDescription>Details for Bus No: {bus.busNo}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Route Information</h4>
                  <p className="text-sm">
                    <strong>Route:</strong> {bus.routeName}
                  </p>
                  <p className="text-sm">
                    <strong>Start:</strong> {bus.startPoint}
                  </p>
                  <p className="text-sm">
                    <strong>End:</strong> {bus.endPoint}
                  </p>
                  <p className="text-sm">
                    <strong>Date:</strong> {bus.scheduleDate}
                  </p>
                  <p className="text-sm">
                    <strong>Time:</strong> {formattedTime}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold">Vehicle Information</h4>
                  <p className="text-sm">
                    <strong>Vehicle ID:</strong> {bus.vehicleId}
                  </p>
                  <p className="text-sm">
                    <strong>Capacity:</strong> {bus.capacity}
                  </p>
                  {bus.gender && (
                    <p className="text-sm">
                      <strong>Gender:</strong> {bus.gender}
                    </p>
                  )}
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold">Staff Information</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium">Driver</p>
                      <p className="text-sm flex items-center">
                        <Users className="h-3 w-3 mr-1" /> {bus.driverName}
                      </p>
                      <p className="text-sm flex items-center">
                        <Phone className="h-3 w-3 mr-1" /> {bus.driverPhone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Helper</p>
                      <p className="text-sm flex items-center">
                        <Users className="h-3 w-3 mr-1" /> {bus.helperName}
                      </p>
                      <p className="text-sm flex items-center">
                        <Phone className="h-3 w-3 mr-1" /> {bus.helperPhone}
                      </p>
                    </div>
                  </div>
                </div>
                {bus.additionalInfo && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-semibold">Additional Info</h4>
                      <p className="text-sm flex items-start">
                        <Info className="h-4 w-4 mr-2 mt-0.5" /> {bus.additionalInfo}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm" className="text-xs font-medium flex-1">
            <Link href={`/track?bus=${bus.busNo}`} className="w-full">
              Live Track
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}