import { _MqttClient, _SerialClient } from "./Client";

export class Manager {
  constructor() {
    console.log("manager init");
  }

  create(name: string, source: any, destination: any): void {
    let receiver: any;
    let sender: any;

    if (source.type === "mqtt") {
      receiver = new _MqttClient({
        host: source.host,
        topic: source.topic,
        onData: (data) => {
          sender.send(data);
        },
        isSender: false,
      });
    } else {
      receiver = new _SerialClient({
        port: source.port,
        baudRate: source.baudRate,
        onData: (data) => {
          sender.send(data);
        },
        isSender: false,
      });
    }

    if (destination.type === "mqtt") {
      sender = new _MqttClient({
        host: destination.host,
        topic: destination.topic,
      });
    } else {
      sender = new _SerialClient({
        port: destination.port,
        baudRate: destination.baudRate,
      });
    }

    // connect
    receiver.connect();
    sender.connect();
  }
}
