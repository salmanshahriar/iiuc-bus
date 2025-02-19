import { io } from 'socket.io-client'

// Replace with your actual WebSocket server URL
const SOCKET_SERVER_URL = 'ws://your-websocket-server-url'

export const socket = io(SOCKET_SERVER_URL)

export const subscribeToUpdates = (callback: (buses: any) => void) => {
  socket.on('busUpdates', (buses) => {
    callback(buses)
  })
}

export const unsubscribeFromUpdates = () => {
  socket.off('busUpdates')
}

