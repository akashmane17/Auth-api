require("dotenv").config();
import express from "express";
import config from "config";
import cors from "cors";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes/index";
import deserializeUser from "./middleware/deserializeUser";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
// to use cookies
app.use(cookieParser());

//
app.use(
  cors({
    origin: config.get("origin"),
    credentials: true,
  })
);

app.use(deserializeUser);
app.use(router);

const port = config.get("port");

app.listen(port, () => {
  log.info(`App started at http://localhost:${port}`);

  connectToDb();
});
