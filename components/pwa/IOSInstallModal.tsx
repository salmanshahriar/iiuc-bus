"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"

type IOSInstallModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function IOSInstallModal({ isOpen, onClose }: IOSInstallModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Install on iOS</DialogTitle>
          <DialogDescription>Follow these steps to add IIUC Bus Tracker to your home screen:</DialogDescription>
        </DialogHeader>
        <ol className="list-decimal list-inside space-y-2">
          <li>Tap the Share button in Safari</li>
          <li>Scroll down and tap "Add to Home Screen"</li>
          <li>Tap "Add" in the top-right corner</li>
        </ol>
        <Button className="mt-4" onClick={onClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )
}

