class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: { [event: string]: Function[] } = {};

  connect(url: string, onOpen?: () => void) {
    this.socket = new WebSocket(url);
    this.socket.onopen = () => {
      console.log("Connected to WebSocket");
      if (onOpen) onOpen();
    };

    this.socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      this.emit(data.event, data.payload);
    };

    return this.socket;
  }

  send(event: string, payload: any) {
    console.log("Sending WebSocket message:", { event, payload });
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ event, payload }));
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    this.listeners[event] = this.listeners[event]?.filter(
      (cb) => cb !== callback
    );
  }

  private emit(event: string, payload: any) {
    this.listeners[event]?.forEach((cb) => cb(payload));
  }

  close() {
    this.socket?.close();
    this.socket = null;
  }
}

export const webSocketService = new WebSocketService();
