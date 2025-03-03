"use client"

import { Clock, Search, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LostItemForm } from "@/components/lost-&-found/LostItemForm"
import { FoundItemsList } from "@/components/lost-&-found/FoundItemsList"
import { motion } from "framer-motion"

export default function LostAndFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background pb-20 md:pb-0">
      {/* Mobile View */}
      <div className="md:hidden container mx-auto px-4 py-6 ">
        <Tabs defaultValue="lost" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-6 bg-muted rounded-lg h-15">
            <TabsTrigger 
              value="lost"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2"
            >
              <Search className="h-4 w-4 mr-2" /> Lost Something?
            </TabsTrigger>
            <TabsTrigger 
              value="found"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2"
            >
              <CheckCircle className="h-4 w-4 mr-2" /> Found Items
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lost" className="mt-0">
            <div className="bg-background rounded-lg shadow-sm">
              <LostItemForm />
            </div>
          </TabsContent>
          
          <TabsContent value="found" className="mt-0">
            <FoundItemsList />
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex container mx-auto h-[calc(100vh-4rem)] py-8 gap-8">
        {/* Left Section - Lost Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-1/2 flex items-center"
        >
          <div className="w-full space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)]">
                  Lost Something?
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Report lost items or check found items in one convenient place
              </p>
            </div>

            <div className="bg-background/95 backdrop-blur-md rounded-xl shadow-lg
              border border-border/40 transition-all duration-300
              hover:shadow-xl hover:border-primary/30">
              <LostItemForm />
            </div>
          </div>
        </motion.div>

        {/* Right Section - Found Items */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-1/2 flex flex-col"
        >
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0 py-6 border-b border-border/50">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)]">
                    Found Items
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground">
                  Recently recovered items from buses
                </p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6">
              <FoundItemsList />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}