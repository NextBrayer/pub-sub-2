
interface MqttClientConfig {
    url: string,
    topic: string,
    username?: string,
    password?: string,
    clientId?: string,
    onData: (data: string) => void
}

class MqttClient {
    private topic: string;
    private url: string;
    private clientId: string;
    private onData: (data: string) => void;

    constructor(opts: MqttClientConfig) {
        this.url = opts.url;
        this.topic = opts.topic;
        this.onData = opts.onData;
        if(opts.clientId) {
            this.clientId = opts.clientId;
        } else {
            this.clientId = this.generateClientId();
        }
    }

    public connect() {
        console.log(`Connecting to ${this.url} with clientId ${this.clientId}`);
        //TODO: handle connection
        setInterval(() => {
            this.onData(`${this.clientId} => hi there`);
        }, 1000);

    }

    public disconnect() {
        console.log(`Disconnecting from ${this.url} with clientId ${this.clientId}`);
    }

    public write(data: string) {
        console.log(`Writing to ${this.topic} with clientId ${this.clientId} : ${data}`);

        // TODO: publish data
    }

    private generateClientId() {
        return Math.random().toString(36).substring(7);
    }
}







async function playground() {
    console.log("playground");

    const myclient1 = new MqttClient({
        url: "mqtt://localhost:1883",
        topic: "mytopic",
        clientId: "myclient1",
        onData: (data) => {
            console.log(`myclient1 received data: ${data}`);
        }
    });

    const mysecondClient = new MqttClient({
        url: "mqtt://localhost:1883",
        topic: "mytopic",
        clientId: "myclient2",
        onData: (data) => {
            myclient1.write(data);
        }
    });

    myclient1.connect();
    mysecondClient.connect();
}

export default playground;