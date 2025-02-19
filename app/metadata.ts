import { Metadata } from "next"

export const metadata: Metadata = {
  title: "IIUC Bus Tracker",
  description: "Live bus tracker for International Islamic University Chittagong students",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IIUC Bus Tracker"
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "IIUC Bus",
    "apple-mobile-web-app-title": "IIUC Bus",
    "msapplication-navbutton-color": "#47fda8",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-starturl": "/"
  }
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#47fda8"
}