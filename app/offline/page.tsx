"use client"

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">You're Offline</h1>
      <p className="text-center mb-4">
        Please check your internet connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-opacity-90"
      >
        Try Again
      </button>
    </div>
  )
}