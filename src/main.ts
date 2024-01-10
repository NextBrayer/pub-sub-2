import express from "express";
import { ConfigurationSchema } from "./zodSchema";
import { MqttTransmitter } from "./MqttClass";

const app = express();
app.use(express.json());

const mqttInstance = new MqttTransmitter();
const expressPort: number = 3000;

app.post("/configuration", (req, res) => {
  console.log("getting new configuration");
  try {
    ConfigurationSchema.parse(req.body);
    res.send("done");
    mqttInstance.connectToMqtt(req.body.SourceData.url);
  } catch (error: any) {
    res.send(error.message);
  }
});

app.get("/status", (req, res) => {
  console.log("status");
  try {
    res.send(mqttInstance.getConnectedClients());
  } catch (error: any) {
    res.send(error.message);
  }
});

app.listen(expressPort, () => {
  console.log("express listening on port", expressPort);
});
