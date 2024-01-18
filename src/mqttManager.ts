import mqtt from "mqtt/*";
import { _MqttClient } from "./MqttClient";

interface mqttConfig {
  url: string;
  name: string;
  username?: string;
  password?: string;
  topic: string;
}

export class MqttManager {
  private _connectedClients: {
    type: string;
    name: string;
    url: string;
    username?: string;
    password?: string;
    client: _MqttClient;
  }[] = [];
  constructor() {
    console.log(" init mqtt manager");
  }

  mqttConfiguration(source: mqttConfig, destination: mqttConfig) {
    /// for the source

    this.handelmqttSource(source);

    /// for the source
    this.handelmqttDestination(destination);
  }

  async handelmqttSource(config: mqttConfig) {
    let subscriber = new _MqttClient({ host: config.url });
    const exist = this.find_if_exist(config, "source");
    if (exist === -1) {
      await subscriber.connect();
      this.add_to_list(config, "source", subscriber);
    } else subscriber = this._connectedClients[exist].client;

    subscriber.subscribe(config.topic);
  }

  async handelmqttDestination(config: mqttConfig) {
    let publisher = new _MqttClient({ host: config.url });
    const exist = this.find_if_exist(config, "destinaton");
    if (exist === -1) {
      await publisher.connect();
      this.add_to_list(config, "destinaton", publisher);
    } else publisher = this._connectedClients[exist].client;
  }

  connectedClients() {
    const connected = this._connectedClients.map((client) => ({
      name: client.name,
      type: client.type,
    }));
    return connected;
  }

  disconnect(name: string) {
    const element = this._connectedClients.find(
      (element) => element.name === name
    );
    element?.client.disconnect();
    this._connectedClients = this._connectedClients.filter(
      (element) => element.name != name
    );
    return this._connectedClients
  }

  pause(name: string, topic: string) {
    const element = this._connectedClients.find(
      (element) => element.name === name
    );
    element?.client.unSubscribe(topic);
  }

  resume(name: string, topic: string) {
    const element = this._connectedClients.find(
      (element) => element.name === name
    );
    element?.client.subscribe(topic);
  }
  find_if_exist(config: mqttConfig, type: string) {
    return this._connectedClients.findIndex(
      (element) =>
        element.url === config.url &&
        element.username === config.username &&
        element.password === config.password &&
        element.type === type
    );
  }

  add_to_list(config: mqttConfig, type: string, client: _MqttClient) {
    this._connectedClients.push({
      type: type,
      name: config.name,
      url: config.url,
      username: config.username,
      password: config.password,
      client: client,
    });
  }
}
