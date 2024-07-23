import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import "dotenv/config"
import express from "express"
import mongoose from "mongoose"
import morgan from "morgan"
import allRoutes from "./routes/index"
import adminSeeder from "./seeders/AdminSeeder"

import "./jobs/checkSubscriptions.js"

const app = express()

const connect = () => {
  mongoose
    .connect(process.env.MONGO_DATABASE)
    .then(() => console.log("connected to db"))
    .then(() => {
      adminSeeder()
      app.use(express.json())
    })
    .catch((err) => {
      throw err
    })
}
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(morgan("dev"))
app.use(bodyParser.json())
const port = process.env.PORT
try {
  app.use("/api/v1", allRoutes)
} catch (error) {
  console.log(error)
}
app.listen(port, () => {
  connect()
  console.log(`http://localhost:${port}`)
})
export default app
