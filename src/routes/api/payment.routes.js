import { Router } from "express";
import { createSubscription, getAllSubscriptions } from '../../controllers/payment.controller.js';
import extractToken from "../../middlewares/checkUserWithToken";

const router = Router();

router.post('/', extractToken, createSubscription);
router.get('/',extractToken,getAllSubscriptions)

export default router;
