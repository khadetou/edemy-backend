import fs from "fs";
import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";

//Morgan
const morgan = require("morgan");

//INITIALISING DOTENV AND EXPRESS
dotenv.config();
const app = express();
const { PORT, NODE_ENV } = process.env;

//connection to the database.
connectDB();

//Allow us to take data from the body for the authentification
//Should be placed before our requests
app.use(express.json({ extended: false }));

//CRUD Routing generated authomatically
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
});

fs.readdirSync("./routes").map((route) =>
  app.use("/api", require(`./routes/${route}`))
);

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
