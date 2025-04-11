import express from 'express';
import { forgotPass, login, signup } from '../controllers/authController.js';
const authRoutes = express.Router();
authRoutes.post('/login', login);
authRoutes.post('/signup', signup);
authRoutes.post('/forgot', forgotPass)
export default authRoutes;