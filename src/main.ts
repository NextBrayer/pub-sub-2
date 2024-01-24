import express from "express";
import { Manager } from "./Manager";

import playground from "./test";

async function main() {
  
const app = express();
app.use(express.json());
const expressPort: number = 3000;

const ManagerObject = new Manager();

app.post("/configuration", (req, res) => {
  console.log("getting new configuration");
  try {
    res.send("done");
    ManagerObject.Configuration(
      req.body.name,
      req.body.source,
      req.body.destination
    );
  } catch (error: any) {
    res.send(error.message);
  }
});

app.get("/status", (req, res) => {
  console.log("status");
  const connectedClients = ManagerObject.getClients();
  res.send(connectedClients);
  try {
  } catch (error: any) {
    res.send(error.message);
  }
});

app.get("/pause", (req, res) => {
  console.log("client paused");
  ManagerObject.pauseClient(req.body.name);
  res.send("client paused");
  try {
  } catch (error: any) {
    res.send(error.message);
  }
});

app.get("/resume", (req, res) => {
  console.log("resume client");
  ManagerObject.resumeClient(req.body.name);
  res.send("client resume");
  try {
  } catch (error: any) {
    res.send(error.message);
  }
});

app.listen(expressPort, () => {
  console.log("express listening on port", expressPort);
});

}

// main();
playground();