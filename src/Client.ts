import * as mqtt from "mqtt";
import { v4 as uuidv4 } from "uuid";
import { SerialPort } from "serialport";

interface Client {
  connect(): void;
  onMessage(): void;
  send(message: any): void;
  isConnected(): boolean;
  disconnect(): void;
}

interface mqttClient {
  host: string;
  topic: string;
  onData?: (data: any) => void;
  isSender?: boolean;
  username?: string;
  password?: string;
}

interface serialClient {
  port: string;
  baudRate: number;
  onData?: (data: any) => void;
  isSender?: boolean;
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
        console.log("error in mqtt", error.message);
        resolve(null);
      });

      this.client.on("connect", () => {
        console.log("connected to mqtt");
        if (!this.isSender) this.subscribe();
        resolve(this.client);
      });
    });
  }

  subscribe() {
    console.log("in subscriber");
    if (this.client) {
      this.client.subscribe(this.topic);
      console.log("subscribed to", this.topic);
      if (!this.isSender) this.onMessage();
    }
  }

  onMessage() {
    if (this.client)
      this.client.on("message", (topic, message) => {
        console.log(topic, message.toString());
        if (this.onData) this.onData(message.toString());
      });
  }

  send(message: any) {
    if (this.client) {
      console.log("publishing to ", this.topic, message.toString());
      this.client.publish(this.topic, message.toString());
    }
  }

  disconnect() {
    if (this.client) {
      console.log("disconnecting");
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

export class _SerialClient implements Client {
  private serial: null | SerialPort;
  private port: string;
  private baudRate: number;
  private isSender: boolean;
  private onData?: (data: any) => void;

  constructor(opts: serialClient) {
    console.log("initialze serial communication");
    this.serial = null;
    this.baudRate = opts.baudRate;
    this.port = opts.port;
    if (opts.isSender != null) this.isSender = opts.isSender;
    else this.isSender = true;
    if (opts.onData != null) this.onData = opts.onData;
    else this.onData = undefined;
  }

  async connect() {
    return new Promise<SerialPort | null>((resolve) => {
      this.serial = new SerialPort({
        path: this.port,
        baudRate: this.baudRate,
      });

      this.serial.on("error", (error) => {
        console.log("error in opening serialport", error.message);
        this.retry();
        resolve(null);
      });

      this.serial.on("open", () => {
        console.log("serial port opened successufuly");
        if (!this.isSender) this.onMessage();
        resolve(this.serial);
      });
    });
  }

  disconnect() {
    this.serial!.close();
  }

  onMessage() {
    if (this.serial)
      this.serial.on("data", (data) => {
        console.log("Data:", data);
        if (this.onData) this.onData(data);
      });
  }

  send(message: any) {
    this.serial!.write(message);
  }

  retry() {
    setTimeout(async () => {
      await this.connect();
    }, 30000);
  }

  isConnected() {
    return this.serial!.isOpen;
  }
}
