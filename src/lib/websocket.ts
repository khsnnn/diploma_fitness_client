import { Club } from '@/types/club';

interface WebSocketMessage {
  clubId: number;
  status: 'open' | 'closed';
}

export class WebSocketClient {
  private socket: WebSocket | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url; // Например, ws://localhost:8080/ws
  }

  connect(onMessage: (data: WebSocketMessage) => void) {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('WebSocket подключён');
    };

    this.socket.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      onMessage(data);
    };

    this.socket.onerror = (error) => {
      console.error('Ошибка WebSocket:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket закрыт');
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}