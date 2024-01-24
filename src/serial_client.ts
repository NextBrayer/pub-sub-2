import { SerialPort } from "serialport";
import { Client } from "./client";

interface serialClient {
  port: string;
  baudRate: number;
  onData?: (data: any) => void;
  isSender?: boolean;
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
    }, 5000);
  }

  isConnected() {
    return this.serial!.isOpen;
  }
}
