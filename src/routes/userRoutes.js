import express from 'express'
import authMiddleware from '../middleware/auth.js';
import {registerUser,loginUser,getProfile} from '../controllers/userController.js';

const router = express.Router();


router.post("/signup",registerUser);
router.post("/login",loginUser);
router.get("/profile",authMiddleware,getProfile);

export default router;