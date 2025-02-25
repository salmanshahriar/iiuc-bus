"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Search,
  MapPin,
  AlertCircle,
  Clock,
  User,
  Navigation,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetchScheduleSuggestions } from "@/utils/api";

interface BusSearchProps {
  onSearch: (params: { from: string; to: string; date: string }) => Promise<void>;
  currentDateTime: string;
  userLogin: string;
}

export function BusSearch({ onSearch, currentDateTime, userLogin }: BusSearchProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [startPoints, setStartPoints] = useState<string[]>([]);
  const [endPoints, setEndPoints] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  // Fetch location suggestions from API
  useEffect(() => {
    async function getScheduleSuggestions() {
      try {
        const data = await fetchScheduleSuggestions();
        console.log("API Response:", data); // Debug API response
        setStartPoints(data.startPoints || []);
        setEndPoints(data.endPoints || []);
      } catch (error) {
        console.error("Failed to fetch schedule suggestions:", error);
      }
    }
    getScheduleSuggestions();
  }, []);

  // Validation logic
  const validateSelection = (fromVal: string, toVal: string) => {
    if (!fromVal || !toVal) return null;
    if (fromVal === toVal) return "Cannot select the same location";
    if (fromVal === "University" && toVal === "University")
      return "Cannot select University for both locations";
    if (fromVal !== "University" && toVal !== "University")
      return "One location must be University";
    return null;
  };

  const handleSearch = async () => {
    if (!from || !to || !date) return;

    const error = validateSelection(from, to);
    if (error) {
      setValidationError(error);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    try {
      await onSearch({
        from,
        to,
        date: format(date, "yyyy-MM-dd"),
      });
    } catch (error) {
      console.error("Search failed:", error);
      setSearchError("Failed to fetch bus schedules. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const clearFrom = () => {
    setFrom("");
    setValidationError(validateSelection("", to));
    setFromOpen(false); // Optionally close suggestions
  };

  const clearTo = () => {
    setTo("");
    setValidationError(validateSelection(from, ""));
    setToOpen(false); // Optionally close suggestions
  };

  return (
    <div
      className="relative space-y-4 p-3 sm:p-6 md:p-8 
      bg-background/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-border/50 
      shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] 
      hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.15)]
      transition-all duration-500 ease-out"
    >
      <div className="grid gap-3 sm:gap-5">
        {/* Route Selection */}
        <div className="grid gap-2 sm:gap-4 sm:grid-cols-2">
          {/* From Location */}
          <div className="group space-y-1">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground/80 ml-1">
              <Navigation className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              From
            </label>
            <div className="relative">
              <Command>
                <div className="relative">
                  <CommandInput
                    placeholder="Type departure location..."
                    value={from}
                    onValueChange={(value) => {
                      setFrom(value);
                      setFromOpen(true);
                      setValidationError(validateSelection(value, to));
                    }}
                    onFocus={() => setFromOpen(true)}
                    onBlur={() => setTimeout(() => setFromOpen(false), 200)}
                    className="h-10 sm:h-12 bg-background/60 backdrop-blur-sm rounded-lg sm:rounded-xl 
                      border-border/50 text-sm shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)] 
                      group-hover:shadow-[0_4px_20px_-4px_rgba(242,78,30,0.15)] 
                      transition-all duration-300 pr-10" // Added padding-right for X button
                  />
                  {from && (
                    <button
                      onClick={clearFrom}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {fromOpen && startPoints.length > 0 && (
                  <CommandList className="absolute z-10 top-12 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                    <CommandEmpty>No location found.</CommandEmpty>
                    {startPoints
                      .filter((point) =>
                        from ? point.toLowerCase().includes(from.toLowerCase()) : true
                      )
                      .map((point) => (
                        <CommandItem
                          key={point}
                          value={point}
                          onSelect={(selectedValue) => {
                            setFrom(selectedValue);
                            setFromOpen(false);
                            setValidationError(validateSelection(selectedValue, to));
                          }}
                          className="cursor-pointer hover:bg-accent"
                        >
                          <span
                            className={
                              point === "University"
                                ? "text-primary font-medium"
                                : "text-foreground"
                            }
                          >
                            {point}
                          </span>
                        </CommandItem>
                      ))}
                  </CommandList>
                )}
              </Command>
            </div>
          </div>

          {/* To Location */}
          <div className="group space-y-1">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground/80 ml-1">
              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              To
            </label>
            <div className="relative">
              <Command>
                <div className="relative">
                  <CommandInput
                    placeholder="Type destination location..."
                    value={to}
                    onValueChange={(value) => {
                      setTo(value);
                      setToOpen(true);
                      setValidationError(validateSelection(from, value));
                    }}
                    onFocus={() => setToOpen(true)}
                    onBlur={() => setTimeout(() => setToOpen(false), 200)}
                    className="h-10 sm:h-12 bg-background/60 backdrop-blur-sm rounded-lg sm:rounded-xl 
                      border-border/50 text-sm shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)] 
                      group-hover:shadow-[0_4px_20px_-4px_rgba(242,78,30,0.15)] 
                      transition-all duration-300 pr-10" // Added padding-right for X button
                  />
                  {to && (
                    <button
                      onClick={clearTo}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {toOpen && endPoints.length > 0 && (
                  <CommandList className="absolute z-10 top-12 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                    <CommandEmpty>No location found.</CommandEmpty>
                    {endPoints
                      .filter((point) =>
                        to ? point.toLowerCase().includes(to.toLowerCase()) : true
                      )
                      .map((point) => (
                        <CommandItem
                          key={point}
                          value={point}
                          onSelect={(selectedValue) => {
                            setTo(selectedValue);
                            setToOpen(false);
                            setValidationError(validateSelection(from, selectedValue));
                          }}
                          className="cursor-pointer hover:bg-accent"
                        >
                          <span
                            className={
                              point === "University"
                                ? "text-primary font-medium"
                                : "text-foreground"
                            }
                          >
                            {point}
                          </span>
                        </CommandItem>
                      ))}
                  </CommandList>
                )}
              </Command>
            </div>
          </div>
        </div>

        {/* Validation Error Message */}
        <AnimatePresence>
          {(validationError || searchError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-xs sm:text-sm text-destructive p-2 sm:p-4 rounded-lg sm:rounded-xl 
                bg-destructive/8 border border-destructive/15"
            >
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="leading-tight">{validationError || searchError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Date Picker */}
        <div className="group space-y-1">
          <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground/80 ml-1">
            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Date
          </label>
          <DatePicker
            date={date}
            onDateChange={(newDate) => {
              if (newDate) {
                setDate(newDate);
              }
            }}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
            }}
          />
        </div>
      </div>

      {/* Search Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] 
                  hover:from-[var(--gradient-from)]/50 hover:to-[--gradient-to)]/50 hover:opacity-90
                  shadow-[0_4px_20px_-4px_rgba(242,78,30,0.3)]
                  hover:shadow-[0_4px_28px_-4px_rgba(242,78,30,0.45)]
                  active:scale-[0.98]
                  transition-all duration-300 group relative text-sm"
                onClick={handleSearch}
                disabled={isSearching || !from || !to || !!validationError}
              >
                <div
                  className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Search Buses</span>
                  </div>
                )}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="bg-background/80 backdrop-blur-lg border-border/50 text-xs sm:text-sm"
          >
            {!from || !to ? (
              <p>Please select both locations</p>
            ) : validationError ? (
              <p>{validationError}</p>
            ) : (
              <p>Search for available buses</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Status Footer */}
      <div
        className="pt-2 sm:pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 
        text-[10px] sm:text-xs text-muted-foreground/60 border-t border-border/40"
      >
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>Updated: {format(new Date(currentDateTime), "HH:mm:ss")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>{userLogin}</span>
        </div>
      </div>
    </div>
  );
}