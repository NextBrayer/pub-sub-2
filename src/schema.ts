import { DataShare } from "./DataShare";
import { _MqttClient } from "./MqttClient";
import { SerialClient } from "./SerialClient";

interface mqtt {
  type: string;
  url: string;
  username?: string;
  password?: string;
  topic: string;
}

interface serial {
  type: string;
  port: string;
  baudRate: number;
}
interface Clients {
  name: string;
  valueHolder: DataShare;
  source?: {
    type: string;
    url?: string;
    topic?: string;
    port?: string;
    baudRate?: number;
    client: _MqttClient | SerialClient;
  };
  destination?: {
    type: string;
    url?: string;
    topic?: string;
    port?: string;
    baudRate?: number;
    client: _MqttClient | SerialClient;
  };
}

enum IN_OUT {
  SOURCE,
  DESTINATION,
}

export { mqtt, serial, Clients, IN_OUT };
