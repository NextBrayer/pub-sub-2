import { DataShare } from "./DataShare";
import { _MqttClient } from "./MqttClient";
import { SerialClient } from "./SerialClient";
import { serial, mqtt, connectedClients, IN_OUT } from "./schema";
export class Manager {
  private _connectedClients: connectedClients[] = [];
  constructor() {
    console.log(" init mqtt manager");
  }

  Configuration(
    name: string,
    source: mqtt | serial,
    destination: mqtt | serial
  ) {
    const valueHolder = new DataShare();

    /// for the source
    this.handelSource(name, source, valueHolder);

    /// for the source
    this.handelDestination(name, destination, valueHolder);
  }

  async handelSource(
    name: string,
    source: mqtt | serial,
    valueHolder: DataShare
  ) {
    if (source.type === "mqtt") {
      source = source as mqtt;
      let subscriber = new _MqttClient({ host: source.url });
      subscriber.valueHolder = valueHolder;
      const client = await subscriber.connect();
      if (client) this.add_to_list(source, name);
      else return;

      subscriber.subscribe(source.topic);
    } else if (source.type === "serial") {
      source = source as serial;
      let serial = new SerialClient();
      const client = await serial.open(source.port, source.baudRate);
      if (client) serial.read(valueHolder);
    } else console.log("couldnt handel this type ", source.type);
  }

  async handelDestination(
    name: string,
    destination: mqtt | serial,
    valueHolder: DataShare
  ) {
    if (destination.type === "mqtt") {
      destination = destination as mqtt;
      let publisher = new _MqttClient({ host: destination.url });

      const client = await publisher.connect();
      if (client) this.add_to_list(destination, name);
      else return;

      valueHolder.registerCallback((newValue: any) => {
        destination = destination as mqtt;
        publisher.publish(destination.topic, newValue);
      });
    } else if (destination.type === "serial") {
      destination = destination as serial;
      let serial = new SerialClient();
      const client = await serial.open(destination.port, destination.baudRate);
      if (client)
        valueHolder.registerCallback((newValue: any) => {
          serial.write(newValue);
        });
    } else console.log("couldnt handel this type ", destination.type);
  }

  connectedClients() {
    const connected = this._connectedClients.map((client) => ({
      name: client.name,
    }));
    return connected;
  }

  add_to_list(config: mqtt | serial, name: string) {
    this._connectedClients.push({
      name: name,
    });
  }
}
