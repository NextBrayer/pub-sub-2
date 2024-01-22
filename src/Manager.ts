import { DataShare } from "./DataShare";
import { _MqttClient } from "./MqttClient";
import { SerialClient } from "./SerialClient";
import { serial, mqtt, Clients } from "./schema";
export class Manager {
  private _Clients: Clients[] = [];
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
    this.add_to_list(name, valueHolder);
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
      const data = {
        type: source.type,
        url: source.url,
        topic: source.topic,
        client: subscriber,
      };
      this.add_to_list(name, valueHolder, data, null);
      subscriber.valueHolder = valueHolder;
      const client = await subscriber.connect();
      if (client) subscriber.subscribe(source.topic);
      else return;
    } else if (source.type === "serial") {
      source = source as serial;
      let serial = new SerialClient();
      const data = {
        type: source.type,
        port: source.port,
        baudRate: source.baudRate,
        client: serial,
      };
      this.add_to_list(name, valueHolder, data, null);
      const client = await serial.open(source.port, source.baudRate);
      if (client) serial.read(valueHolder);
      else return;
    } else {
      console.log("couldnt handel this type ", source.type);
      return;
    }
  }

  async handelDestination(
    name: string,
    destination: mqtt | serial,
    valueHolder: DataShare
  ) {
    if (destination.type === "mqtt") {
      destination = destination as mqtt;
      let publisher = new _MqttClient({ host: destination.url });
      const data = {
        type: destination.type,
        url: destination.url,
        topic: destination.topic,
        client: publisher,
      };
      this.add_to_list(name, valueHolder, null, data);
      const client = await publisher.connect();
      if (client)
        valueHolder.registerCallback((newValue: any) => {
          destination = destination as mqtt;
          publisher.publish(destination.topic, newValue);
        });
      else return;
    } else if (destination.type === "serial") {
      destination = destination as serial;
      let serial = new SerialClient();
      const data = {
        type: destination.type,
        port: destination.port,
        baudRate: destination.baudRate,
        client: serial,
      };
      this.add_to_list(name, valueHolder, null, data);
      const client = await serial.open(destination.port, destination.baudRate);
      if (client)
        valueHolder.registerCallback((newValue: any) => {
          serial.write(newValue);
        });
      else return;
    } else {
      console.log("couldnt handel this type ", destination.type);
      return;
    }
  }

  getClients() {
    const connected = this._Clients.map((client) => ({
      name: client.name,
      source: {
        type: client.source?.type,
        url_port: client.source?.port || client.source?.url,
        baudRate_topic: client.source?.baudRate || client.source?.topic,
        connected: client.source?.client.isConnected(),
      },
      destination: {
        type: client.destination?.type,
        url_port: client.destination?.port || client.destination?.url,
        baudRate_topic:
          client.destination?.baudRate || client.destination?.topic,
        connected: client.destination?.client.isConnected(),
      },
    }));
    return connected;
  }

  add_to_list(
    name: string,
    valueHolder: DataShare,
    source?: any,
    destination?: any
  ) {
    const isAlreadySaved = this._Clients.findIndex(
      (client) => client.name === name
    );
    if (isAlreadySaved === -1)
      this._Clients.push({
        name: name,
        valueHolder: valueHolder,
      });
    else if (source) this._Clients[isAlreadySaved].source = source;
    else this._Clients[isAlreadySaved].destination = destination;
  }

  pauseClient(name: string) {
    const client = this._Clients.filter((client) => client.name === name)[0];
    client.valueHolder.pauseNotification();
  }
  resumeClient(name: string) {
    const client = this._Clients.filter((client) => client.name === name)[0];
    client.valueHolder.resumeNotification();
  }
}
