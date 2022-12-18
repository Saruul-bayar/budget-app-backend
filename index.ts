import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookies from "cookie-parser";
import { connectToDB } from "./src/models/";

dotenv.config();
const app = express();

const port = process.env.PORT || 4000;

const main = async () => {
  app.use(cookies());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  // parse application/json
  app.use(bodyParser.json());

  app.use("/auth", require("./src/routes/auth"));
  app.use("/user", require("./src/routes/user"));
  app.use("/orlogo", require("./src/routes/orlogo"));
  app.use("/zarlaga", require("./src/routes/zarlaga"));

  app.get("/", (req, res) => {
    res.send("we are on home");
  });
  await connectToDB();
  app.listen(port);
};
main();
