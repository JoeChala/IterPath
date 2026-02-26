import express from 'express'
import { completeProfile } from '../controllers/recruiter.controller.js';

const router = express.Router();

router.post("/complete-profile",completeProfile);

export default router;