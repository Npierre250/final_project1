import { Router } from "express";
import upload from "../../config/multer";
import { createApplication } from "../../controllers/application.controller";

const router=Router()

router.post('/',upload.single('licenceCopy'),createApplication)
export default router;