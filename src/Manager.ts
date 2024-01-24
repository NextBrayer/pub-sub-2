import { _MqttClient } from "./mqtt_client";
import { _SerialClient } from "./serial_client";


export class Manager {
  constructor() {
    console.log("manager init");
  }

  create(name: string, source: any, destination: any): void {
    let receiver: any;
    let sender: any;



    // connect
    receiver.connect();
    sender.connect();
  }
}
