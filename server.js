import fs from "fs";
import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/error";

//Morgan
const morgan = require("morgan");

//INITIALISING DOTENV AND EXPRESS
dotenv.config();
const app = express();
const { PORT, NODE_ENV } = process.env;

/**MIDDLEWARES */
app.use(cors());
app.options("*", cors());

//connection to the database.
connectDB();

//Allow us to take data from the body for the authentification
//Should be placed before our requests
app.use(express.json({ limit: "500mb" }));

//CRUD Routing generated authomatically
fs.readdirSync("./routes").map((route) => {
  app.use("/api", require(`./routes/${route}`));
});

//Show us the actions that we hit
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Middleware error handler
app.use(notFound);
app.use(errorHandler);

//SETTING THE PORT
const PORTV = PORT || 8000;
app.listen(
  PORT,
  console.log(
    `Server is running in ${NODE_ENV} mode on port ${PORTV}`.bold.green
  )
);
