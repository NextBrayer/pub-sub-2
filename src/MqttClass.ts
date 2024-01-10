import * as mqtt from "mqtt";
import { v4 as uuidv4 } from "uuid";

interface connectedClinets {
  id: string;
  host: string;
  username: string;
  password: string;
  client: mqtt.MqttClient;
}
export class MqttTransmitter {
  private connectedClinets: connectedClinets[] = [];
  constructor() {
    console.log(" mqtt init");
  }

  async connectToMqtt(
    host: string,
    username: string = "",
    password: string = ""
  ) {
    console.log(`checking if the ${host} already connected`);
    const isAlreadyConnectedClient = await this.checkExistingConnections(
      host,
      username,
      password
    );
    if (isAlreadyConnectedClient) {
      console.log("already  connected to", host);
      return isAlreadyConnectedClient;
    }
    console.log("trying to connect", host);
    return new Promise<mqtt.MqttClient | null>((resolve) => {
      const client = mqtt.connect({
        clientId: uuidv4(),
        host: host,
        port: 1883,
        username: username,
        password: password,
      });

      client.on("error", (error) => {
        console.log("error in mqtt", error.message);
        resolve(null);
      });

      client.on("connect", () => {
        console.log("connected to mqtt");
        const data = {
          id: uuidv4(),
          host: host,
          username: username,
          password: password,
          client: client,
        };
        this.connectedClinets.push(data);
        resolve(client);
      });
    });
  }

  async subscribeToMqtt(client: mqtt.MqttClient, topic: string) {
    client.subscribe(topic);
    console.log("subscribed to", topic);
    client.on("message", (topic, message) => {
      console.log(topic, message.toString());
    });
  }

  async unSubscribeFromMqtt(id: String, topic: string) {
    const clientExist = this.connectedClinets.filter(
      (client) => client.id === id
    )[0];
    if (clientExist) clientExist.client.unsubscribe(topic);
    console.log("unsubscribed from", topic);
  }
  async publishToMqtt(client: mqtt.MqttClient, topic: string, message: any) {
    client.publish(topic, message.toString());
  }

  async getConnectedClients() {
    const connectedClient =  this.connectedClinets.map((client) => {
      if (client.client.connected)
        return {
          id: client.id,
          host: client.host,
          username: client.username,
          password: client.password,
        };
    });
    return connectedClient;
  }
  async checkExistingConnections(
    host: string,
    username: string,
    password: string
  ) {
    const isAlreadyConnected = this.connectedClinets.find((client) => {
      if (
        client.host === host &&
        client.username === username &&
        client.password === password
      )
        return true;
      return false;
    });
    if (isAlreadyConnected) return isAlreadyConnected.client;
    return undefined;
  }
}
