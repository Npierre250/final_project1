import { Router } from "express";
import { createSubscription } from '../../controllers/payment.controller.js';

const router = Router();

router.post('/', createSubscription);

export default router;
