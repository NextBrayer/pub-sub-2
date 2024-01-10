import express from "express";
import { MqttManager } from "./mqttManager";

const app = express();
app.use(express.json());
const expressPort: number = 3000;

const mqttManager = new MqttManager();


app.post("/configuration", (req, res) => {
  console.log("getting new configuration");
  try {
    res.send("done");
    mqttManager.mqttConfiguration(
      req.body.Source,
      req.body.Destination
    );
  } catch (error: any) {
    res.send(error.message);
  }
});

app.get("/status", (req, res) => {
  console.log("status");
  try {
  } catch (error: any) {
    res.send(error.message);
  }
});

app.listen(expressPort, () => {
  console.log("express listening on port", expressPort);
});
