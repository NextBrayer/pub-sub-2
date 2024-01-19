interface mqtt {
  type: string;
  url: string;
  username?: string;
  password?: string;
  topic: string;
}

interface connectedClients {
  name: string;
  Source ? : mqtt | serial
  Destination ? : mqtt | serial
}


enum IN_OUT {
  SOURCE,
  DESTINATION,
}

interface serial {
  type: string;
  port: string;
  baudRate: number;
}

export { mqtt, serial, connectedClients, IN_OUT };
