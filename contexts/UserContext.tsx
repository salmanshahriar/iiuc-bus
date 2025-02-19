"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { type Language, type TranslationKey, translations } from "@/lib/translations"

type BusType = "male" | "female" | "teacher" | "administrative" | "staff"

interface UserContextType {
  language: Language
  setLanguage: (lang: Language) => void
  busType: BusType
  setBusType: (type: BusType) => void
  translate: (key: TranslationKey) => string
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en")
  const [busType, setBusType] = useState<BusType>("male")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) setLanguage(savedLanguage)

    const savedBusType = localStorage.getItem("busType") as BusType
    if (savedBusType) setBusType(savedBusType)
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  useEffect(() => {
    localStorage.setItem("busType", busType)
  }, [busType])

  const translate = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  return (
    <UserContext.Provider value={{ language, setLanguage, busType, setBusType, translate }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}