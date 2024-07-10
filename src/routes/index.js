import e from "express";
import applications from "./api/application.routes"
import users from "./api/users.routes"
import schedules from "./api/schedule.routes"
import subscriptionRoute from "./api/payment.routes"

const routes=e.Router()

routes.use('/applications',applications)
routes.use('/users',users)
routes.use('/schedules',schedules)
routes.use('/subscription',subscriptionRoute)
export default routes
