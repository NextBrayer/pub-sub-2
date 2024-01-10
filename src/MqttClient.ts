import * as mqtt from "mqtt";
import { v4 as uuidv4 } from "uuid";

interface mqttData {
  host: string;
  password?: string;
  username?: string;
}

export class _MqttClient {
  private host: string;
  private username: string;
  private password: string;
  private client: mqtt.MqttClient | null;

  constructor(metadat: mqttData) {
    this.host = metadat.host;
    this.username = metadat.username || "";
    this.password = metadat.password || "";
    this.client = null;
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
        resolve(this.client);
      });
    });
  }

  subscribe(topic: string) {
    if (this.client) {
      this.client.subscribe(topic);
      console.log("subscribed to", topic);
      this.client.on("message", (topic, message) => {
        console.log(topic, message.toString());
      });
    }
  }

  unSubscribe(topic: string) {
    if (this.client) {
      this.client.unsubscribe(topic);
      console.log("unsubscribed from", topic);
    }
  }

  publish(topic: string, message: any) {
    if (this.client) {
      console.log("publishing to ", topic, message.toString());
      this.client.publish(topic, message.toString());
    }
  }

  isConnected() {
    if (this.client) return this.client.connected;
    return false;
  }
}
