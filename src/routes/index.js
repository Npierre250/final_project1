import e from "express";
import applications from "./api/application.routes"

const routes=e.Router()

routes.use('/applications',applications)

export default routes
