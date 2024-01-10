import express from "express";
import { ConfigurationSchema } from "./zodSchema";


const app = express();
app.use(express.json());


const expressPort: number = 3000;

app.post("/configuration", (req, res) => {
  console.log("getting new configuration");
  try {
    ConfigurationSchema.parse(req.body);
    res.send("done");
  } catch (error: any) {
    res.send(error.message);
  }
});

app.listen(expressPort, () => {
  console.log("express listening on port", expressPort);
});
