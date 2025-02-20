"use client"

import { Clock, Search, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LostItemForm } from "@/components/lost-&-found/LostItemForm"
import { FoundItemsList } from "@/components/lost-&-found/FoundItemsList"
import { motion } from "framer-motion"

export default function LostAndFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] md:fixed md:inset-0 md:top-16">
      {/* Mobile View - scrollable */}
      <div className="md:hidden p-4">

        <Tabs defaultValue="lost" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="lost">
              <Search className="h-4 w-4 mr-2" /> Lost something?
            </TabsTrigger>
            <TabsTrigger value="found">
              <CheckCircle className="h-4 w-4 mr-2" /> Found items!
            </TabsTrigger>
          </TabsList>
          <TabsContent value="lost" className="mt-0">
            <LostItemForm />
          </TabsContent>
          <TabsContent value="found" className="mt-0">
            <div className="grid gap-4">
              <FoundItemsList />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop View - Fixed */}
      <div className="hidden md:flex h-full ">
        {/* Left side */}
        <div className="flex-1 flex items-center justify-center px-16 ml-20">
          <div className="max-w-2xl w-full space-y-8">
            <div className="space-y-6">
              <h1 className="text-center text-6xl font-bold leading-tight tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] animate-gradient">
                  Lost Something?
                </span>
              </h1>
              <p className="text-center text-xl text-muted-foreground/80">
                Report lost items or check found items in one place
              </p>
            </div>

            <div className="bg-background/40 backdrop-blur-xl rounded-2xl p-8
              border border-border/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)]
              hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] transition-all duration-300
              hover:border-primary/20">
              <LostItemForm />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="w-[450px] border-l">
          <motion.div
            key="found-items"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full flex flex-col"
          >
            <div className="flex-shrink-0 px-6 lg:px-8 py-6 bg-background/50 backdrop-blur-xl border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">
                    <span className=" bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)]">
                      Found Items
                    </span>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recently found items from buses
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 lg:p-6 space-y-4">
                <FoundItemsList />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

