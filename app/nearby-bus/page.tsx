import dynamic from "next/dynamic"

// Dynamically import the BusTracker component
const BusTracker = dynamic(
  () => import("@/components/nearby-bus/BusTracker"),
  {
    ssr: false, // Disable server-side rendering for this component
    loading: () => (
      // Display this loading component while BusTracker is being loaded
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A5C] mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading bus tracker...</p>
        </div>
      </div>
    ),
  }
)

// The TrackPage component renders the dynamically loaded BusTracker component
export default function TrackPage() {
  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] overflow-hidden">
      {/* <div className="hidden lg:block container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7A5C] to-[#F24E1E]">
            Live Bus Tracking
          </span>
        </h1>
        
      </div> */}

      {/* Main content */}
      <div className="h-full w-full lg:container lg:mx-auto lg:max-w-[1920px]">
        <BusTracker />
      </div>
    </div>
  )
}
