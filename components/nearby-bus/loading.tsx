import type React from "react";

const BusTrackerLoading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center h-screen w-full bg-background/50 backdrop-blur-sm ">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default BusTrackerLoading;