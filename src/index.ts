import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookies from "cookie-parser";

import { connectToDB } from "./models";

dotenv.config();
const app = express();

const port = process.env.PORT || 4000;

const main = async () => {
  app.use(cookies());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  // parse application/json
  app.use(bodyParser.json());

  app.use("/auth", require("./routes/auth"));
  app.use("/user", require("./routes/user"));
  app.use("/orlogo", require("./routes/orlogo"));
  app.use("/zarlaga", require("./routes/zarlaga"));

  app.get("/", (req, res) => {
    res.send("we are on home");
  });
  await connectToDB();
  app.listen(port);
};
main();
