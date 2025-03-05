
import { FC } from "react";
import { Loader } from "lucide-react";

interface BusTrackerLoadingProps {
  message?: string;
}

const BusTrackerLoading: FC<BusTrackerLoadingProps> = ({ 
  message = "Loading your location..." 
}) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="premium-card p-8 max-w-md w-full flex flex-col items-center space-y-6 animate-fade-in">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] rounded-full opacity-20 animate-pulse-subtle"></div>
          <Loader size={40} className="text-primary animate-spin duration-1500" />
        </div>
        
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-medium">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] animate-gradient">
              {message}
            </span>
          </h2>
          <p className="text-sm text-muted-foreground animate-fade-in opacity-80">
            Please wait while we prepare your experience
          </p>
        </div>
        
        <div className="w-full space-y-2 pt-4">
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] w-4/5 rounded-full animate-pulse-subtle"></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Initializing map</span>
            <span className="animate-pulse-subtle">80%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusTrackerLoading;