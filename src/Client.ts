export interface Client {
  connect(): void;
  onMessage(): void;
  send(message: any): void;
  isConnected(): boolean;
  disconnect(): void;
}
