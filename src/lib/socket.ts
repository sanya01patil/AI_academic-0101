import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isMock: boolean = true;

  connect() {
    if (this.isMock) {
      console.log('Socket: Connecting to mock server...');
      return;
    }
    
    this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000');
    
    this.socket.on('connect', () => {
      console.log('Socket: Connected to real server');
    });
  }

  on(event: string, callback: (data: any) => void) {
    if (this.isMock) {
      // Mock event emitter logic could go here or in a separate hook
      return;
    }
    this.socket?.on(event, callback);
  }

  off(event: string, callback: (data: any) => void) {
    this.socket?.off(event, callback);
  }

  emit(event: string, data: any) {
    if (this.isMock) {
      console.log(`Socket [Mock] Emit: ${event}`, data);
      return;
    }
    this.socket?.emit(event, data);
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

export const socketService = new SocketService();
