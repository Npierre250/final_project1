import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import allRoutes from "./routes/index"
import cors from "cors";
import adminSeeder from "./seeders/AdminSeeder";

import './jobs/checkSubscriptions.js';

const app = express();

const connect = () => {
  mongoose
    .connect(process.env.MONGO_DATABASE)
    .then(() => console.log("connected to db"))
    .then(() => {
      adminSeeder()
      app.use(express.json());
    })
    .catch((err) => {
      throw err;
    });
};
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());
const port = process.env.PORT;
try{
  app.use('/api/v1',allRoutes)
}catch(error){
  console.log(error);
}
app.listen(port, () => {
  connect();
  console.log(`http://localhost:${port}`);
});
export default app;
