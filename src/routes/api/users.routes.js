import { Router } from "express";
import { getAllUsers, loginUser, updatePassword } from "../../controllers/user.controller";
import extractToken from "../../middlewares/checkUserWithToken";

const router=Router()

router.post('/login',loginUser)
router.patch('/update-password',updatePassword)
router.get('/',extractToken,getAllUsers)
export default router;