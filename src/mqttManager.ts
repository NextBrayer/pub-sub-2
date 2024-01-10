import { _MqttClient } from "./MqttClient";

interface mqttConfig {
  url: string;
  username?: string;
  password?: string;
  topic: string;
}

export class MqttManager {
  constructor() {
    console.log(" init mqtt manager");
  }

  mqttConfiguration(source: mqttConfig, destination: mqttConfig) {
    /// for the source
    this.handelmqttSource(source);
    /// for the source
    this.handelmqttDestination(destination);
  }

  handelmqttSource(config: mqttConfig) {
    const subscriber = new _MqttClient({ host: config.url });

    subscriber.connect().then(() => {
      subscriber.subscribe(config.topic);
      console.log("subscriber is ", subscriber);
    });
    return subscriber.isConnected;
  }
  handelmqttDestination(config: mqttConfig) {
    const publisher = new _MqttClient({ host: config.url });

    publisher.connect().then(() => {
      setInterval(() => {
        publisher.publish(config.topic, "hello");
        console.log("publisher is ", publisher);
      }, 1000);
    });
    return publisher.isConnected;
  }
}
