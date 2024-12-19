import express from 'express';
import { checkAuth, logout, signup, updateProfile, login } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update-profile', updateProfile);
router.get('/check', checkAuth);

export default router;
