import { Router } from "express";
import { createSubscription } from '../../controllers/payment.controller.js';
import extractToken from "../../middlewares/checkUserWithToken";

const router = Router();

router.post('/', extractToken, createSubscription);

export default router;
