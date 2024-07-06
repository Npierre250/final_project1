import { Router } from "express";
import { createSchedule, getSchedulesByUserId } from "../../controllers/Schedule.controller";
import extractToken from "../../middlewares/checkUserWithToken";

const router=Router()

router.post('/',extractToken,createSchedule)
router.get('/',extractToken,getSchedulesByUserId)
export default router;