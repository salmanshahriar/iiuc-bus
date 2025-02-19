"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Bus, Calendar, Search, MessageCircle, ChevronRight } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { name: "home", path: "/", icon: Home },
  { name: "nearestBuses", path: "/nearby-bus", icon: Bus },
  { name: "schedule", path: "/schedule", icon: Calendar },
  { name: "lostAndFound", path: "/lost-&-found", icon: Search },
  { name: "support", path: "/support", icon: MessageCircle },
];

export function SideNav() {
  const pathname = usePathname();
  const { translate } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      `${isExpanded ? '18rem' : '5rem'}`
    );
  }, [isExpanded]);

  return (
    <div 
      className={cn(
        "fixed top-16 left-0 h-[calc(100vh-4rem)] z-50",
        "transition-all duration-300 ease-in-out",
        "hidden md:block",
        isExpanded ? "w-72" : "w-20",
        "bg-background border-r border-border/50",
        "hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      <nav className="h-full flex flex-col justify-center">
        <div className="flex-1 px-3 flex items-center">
          <div className="w-full space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.name} href={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full group relative",
                      "flex items-center justify-start h-12 px-3",
                      "hover:bg-primary/10 active:scale-[0.98] transition-all",
                      !isExpanded && "justify-center",
                      isActive && "bg-primary/15 text-primary hover:bg-primary/20"
                    )}
                  >
                    <div className={cn(
                      "flex items-center",
                      isActive && "text-primary"
                    )}>
                      <item.icon className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        !isActive && "text-muted-foreground group-hover:text-primary/80",
                        "group-hover:scale-110"
                      )} />
                      {isExpanded && (
                        <span className={cn(
                          "ml-3 text-sm font-medium",
                          !isActive && "text-muted-foreground group-hover:text-foreground"
                        )}>
                          {translate(item.name as keyof typeof translate)}
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                    )}
                    {!isExpanded && (
                      <div className="absolute left-full ml-2 px-2 py-1.5 bg-popover/95 backdrop-blur-sm 
                        rounded-lg invisible opacity-0 translate-x-1 group-hover:visible 
                        group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200
                        text-sm font-medium shadow-lg border border-border/50 whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-3 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(prev => !prev)}
            className={cn(
              "w-full h-10 justify-center",
              "hover:bg-primary/10 active:scale-[0.98]",
              "transition-all duration-200"
            )}
          >
            <ChevronRight className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-300",
              isExpanded && "rotate-180"
            )} />
          </Button>
        </div>
      </nav>
    </div>
  );
}