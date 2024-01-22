import { DataShare } from "./DataShare";
import { _MqttClient } from "./MqttClient";
import { SerialClient } from "./SerialClient";
import { serial, mqtt, Clients } from "./types";
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
    // creating instance for the data to be shared between the source and destination
    const valueHolder = new DataShare();

    this.add_client(name, valueHolder);

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
      this.handel_mqtt_source(name, source as mqtt, valueHolder);
    } else if (source.type === "serial") {
      this.handel_serial_source(name, source as serial, valueHolder);
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
      this.handel_mqtt_destination(name, destination as mqtt, valueHolder);
    } else if (destination.type === "serial") {
      this.handel_serial_destination(name, destination as serial, valueHolder);
    } else {
      console.log("couldnt handel this type ", destination.type);
      return;
    }
  }

  async handel_mqtt_source(name: string, source: mqtt, valueHolder: DataShare) {
    let subscriber = new _MqttClient({ host: source.url });
    const data = {
      type: source.type,
      url: source.url,
      topic: source.topic,
      client: subscriber,
    };
    this.add_client(name, valueHolder, data, null);
    subscriber.valueHolder = valueHolder;
    const client = await subscriber.connect();
    if (client) subscriber.subscribe(source.topic);
    else return;
  }

  async handel_serial_source(
    name: string,
    source: serial,
    valueHolder: DataShare
  ) {
    let serial = new SerialClient();
    const data = {
      type: source.type,
      port: source.port,
      baudRate: source.baudRate,
      client: serial,
    };
    this.add_client(name, valueHolder, data, null);
    const client = await serial.open(source.port, source.baudRate);
    if (client) serial.read(valueHolder);
    else return;
  }

  async handel_mqtt_destination(
    name: string,
    destination: mqtt,
    valueHolder: DataShare
  ) {
    let publisher = new _MqttClient({ host: destination.url });
    const data = {
      type: destination.type,
      url: destination.url,
      topic: destination.topic,
      client: publisher,
    };
    this.add_client(name, valueHolder, null, data);
    const client = await publisher.connect();
    if (client)
      valueHolder.registerCallback((newValue: any) => {
        destination = destination as mqtt;
        publisher.publish(destination.topic, newValue);
      });
    else return;
  }
  
  async handel_serial_destination(
    name: string,
    destination: serial,
    valueHolder: DataShare
  ) {
    let serial = new SerialClient();
    const data = {
      type: destination.type,
      port: destination.port,
      baudRate: destination.baudRate,
      client: serial,
    };
    this.add_client(name, valueHolder, null, data);
    const client = await serial.open(destination.port, destination.baudRate);
    if (client)
      valueHolder.registerCallback((newValue: any) => {
        serial.write(newValue);
      });
    else return;
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

  add_client(
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
