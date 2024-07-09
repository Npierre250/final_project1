import { Router } from "express";
import { createSchedule, deleteSchedule, getAllSchedules, getSchedulesByUserId, updateSchedule, updateScheduleByAdmin } from "../../controllers/Schedule.controller";
import extractToken from "../../middlewares/checkUserWithToken";

const router=Router()

router.post('/',extractToken,createSchedule)
router.get('/user',extractToken,getSchedulesByUserId)
router.get('/',extractToken,getAllSchedules)
router.put('/:id',extractToken,updateSchedule)
router.patch('/:id/admin',extractToken,updateScheduleByAdmin)
router.delete('/:id',extractToken,deleteSchedule)
export default router;