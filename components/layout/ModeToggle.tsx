"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null 

  return (
    <button
      className="relative w-14 h-7 rounded-full bor p-1 flex border items-center"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-200 ${
          theme === "dark" ? "transform translate-x-7" : ""
        }`}
      >
        {theme === "light" ? <Sun className="h-5 w-5 bg-black p-1 rounded-full text-white" /> : <Moon className="h-5 w-5 bg-white p-1 rounded-full text-black" />}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

