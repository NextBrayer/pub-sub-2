import express from "express";
import { Manager } from "./Manager";

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

app.get("/status/connected", (req, res) => {
  console.log("status");
  const connected_clients = ManagerObject.get_connected_clients();
  res.send(connected_clients);
  try {
  } catch (error: any) {
    res.send(error.message);
  }
});
app.get("/status/all", (req, res) => {
  console.log("status");
  const all_clients = ManagerObject.get_all_clients();
  res.send(all_clients);
  try {
  } catch (error: any) {
    res.send(error.message);
  }
});

app.get("/pause", (req, res) => {
  console.log("client paused");
  ManagerObject.pause_client(req.body.name);
  res.send("client paused");
  try {
  } catch (error: any) {
    res.send(error.message);
  }
});

app.get("/resume", (req, res) => {
  console.log("resume client");
  ManagerObject.resume_client(req.body.name);
  res.send("client resume");
  try {
  } catch (error: any) {
    res.send(error.message);
  }
});

app.listen(expressPort, () => {
  console.log("express listening on port", expressPort);
});
