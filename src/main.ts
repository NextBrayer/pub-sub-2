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
    ManagerObject.create(
      req.body.name,
      req.body.source,
      req.body.destination
    );
  } catch (error: any) {
    res.send(error.message);
  }
});



app.listen(expressPort, () => {
  console.log("express listening on port", expressPort);
});
