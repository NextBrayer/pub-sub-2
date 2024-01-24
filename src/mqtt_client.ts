import * as mqtt from "mqtt";
import { v4 as uuidv4 } from "uuid";
import { Client } from "./client";

interface mqttClient {
  host: string;
  topic: string;
  onData?: (data: any) => void;
  isSender?: boolean;
  username?: string;
  password?: string;
}

export class _MqttClient implements Client {
  private host: string;
  private topic: string;
  private onData?: (data: any) => void;
  private isSender: boolean;
  private username: string;
  private password: string;
  private client: mqtt.MqttClient | null;

  constructor(opts: mqttClient) {
    console.log(opts);
    this.host = opts.host;
    this.username = opts.username || "";
    this.password = opts.password || "";
    this.topic = opts.topic;

    this.client = null;
    if (opts.onData != null) this.onData = opts.onData;
    else this.onData = undefined;
    if (opts.isSender != null) this.isSender = opts.isSender;
    else this.isSender = true;
  }

  async connect() {
    console.log("trying to connect", this.host);
    return new Promise<mqtt.MqttClient | null>((resolve) => {
      this.client = mqtt.connect({
        clientId: uuidv4(),
        host: this.host,
        port: 1883,
        username: this.username,
        password: this.password,
      });

      this.client.on("error", (error) => {
        resolve(null);
      });

      this.client.on("connect", () => {
        if (!this.isSender) this.subscribe();
        resolve(this.client);
      });
    });
  }

  subscribe() {
    if (this.client) {
      this.client.subscribe(this.topic);
      if (!this.isSender) this.onMessage();
    }
  }

  onMessage() {
    if (this.client)
      this.client.on("message", (topic, message) => {
        if (this.onData) this.onData(message.toString());
      });
  }

  send(message: any) {
    if (this.client) {
      this.client.publish(this.topic, message.toString());
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end(() => {
        console.log("connection ended");
      });
    }
  }

  isConnected() {
    if (this.client) return this.client.connected;
    return false;
  }
}
