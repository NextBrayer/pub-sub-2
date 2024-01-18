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
    mqttManager.mqttConfiguration(req.body.Source, req.body.Destination);
  } catch (error: any) {
    res.send(error.message);
  }
});

app.get("/status", (req, res) => {
  console.log("status");
  const connectedClients = mqttManager.connectedClients();
  res.send(connectedClients);
  try {
  } catch (error: any) {
    res.send(error.message);
  }
});

app.post("/pause", (req, res) => {
  console.log("disconnect");
  mqttManager.pause(req.body.name, req.body.topic);
  res.send("ok");
  try {
  } catch (error: any) {
    res.send(error.message);
  }
});

app.post("/disconnect", (req, res) => {
  console.log("disconnect");
  mqttManager.disconnect(req.body.name);
  res.send("ok");
  try {
  } catch (error: any) {
    res.send(error.message);
  }
});
app.post("/resume", (req, res) => {
  console.log("disconnect");
  mqttManager.resume(req.body.name, req.body.topic);
  res.send("ok");
  try {
  } catch (error: any) {
    res.send(error.message);
  }
});

app.listen(expressPort, () => {
  console.log("express listening on port", expressPort);
});
