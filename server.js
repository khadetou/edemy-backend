import fs from "fs";
import express from "express";
// import connectDB from './config/db.js';
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";

const morgan = require("morgan");
// import {notFound, errorHandler} from './middleware/errorMiddleware.js';

//INITIALISING DOTENV AND EXPRESS
dotenv.config();
const app = express();
const { PORT, NODE_ENV } = process.env;

//connection to the database.
// connectDB();

//CRUD Routing generated authomatically
fs.readdirSync("./routes").map((route) =>
  app.use("/api", require(`./routes/${route}`))
);

//Neutral expression.

//Allow us to take data from the body for the authentification
//Should be placed before our requests
app.use(express.json({ extended: false }));

//Show us the actions that we hit
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//ProductRoutes crud

/**MIDDLEWARES */
// app.use(notFound);
// app.use(errorHandler);
app.use(cors());

//SETTING THE PORT
const PORTV = PORT || 8000;
app.listen(
  PORT,
  console.log(
    `Server is running in ${NODE_ENV} mode on port ${PORTV}`.bold.green
  )
);
