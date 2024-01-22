import { SerialPort } from "serialport";
import { DataShare } from "./DataShare";

export class SerialClient {
  private serial: null | SerialPort;
  constructor() {
    console.log("initialze serial communication");
    this.serial = null;
  }

  async open(port: string, baudRate: number) {
    return new Promise<SerialPort | null>((resolve) => {
      this.serial = new SerialPort({
        path: port,
        baudRate: baudRate,
      });

      this.serial.on("error", (error) => {
        console.log("error in opening serialport", error.message);
        resolve(null);
      });

      this.serial.on("open", () => {
        console.log("serial port opened successufuly");
        resolve(this.serial);
      });
    });
  }

  close() {
    this.serial!.close();
  }

  read(valueHolder: DataShare) {
    this.serial!.on("data", (data) => {
      console.log("Data:", data);
      valueHolder.setValue(data.toString());
    });
  }

  write(message: any) {
    this.serial!.write(message);
  }

  isConnected(){
    return this.serial!.isOpen
  }
}
