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
    const subscriber = new _MqttClient({ host: config.url });

    const client = await subscriber.connect();

    if (client) {
      this._connectedClients.push({
        type: "source",
        name: config.name,
        client: subscriber,
      });
      subscriber.subscribe(config.topic);
    }
  }

  async handelmqttDestination(config: mqttConfig) {
    const publisher = new _MqttClient({ host: config.url });

    const client = await publisher.connect();

    if (client) {
      this._connectedClients.push({
        type: "source",
        name: config.name,
        client: publisher,
      });
      setInterval(() => {
        publisher.publish(config.topic, "hello");
      }, 1000);
    }
  }

  connectedClients() {
    const connected = this._connectedClients.map((client) => ({
      name: client.name,
      type: client.type,
    }));
    return connected;
  }
}
