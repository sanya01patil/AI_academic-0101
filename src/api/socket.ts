import { io } from 'socket.io-client';

const socketURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const socket = io(socketURL, {
  autoConnect: true,
  reconnection: true,
});

export const initSocket = () => {
  socket.on('connect', () => {
    console.log('Connected to IntegriGuard WebSocket');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from IntegriGuard WebSocket');
  });

  return socket;
};
