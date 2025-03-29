import express from "express";
import { getUser, getUserById, getUserByIdQuery } from "../controllers/userController.js";
const userRoutes = express.Router();
userRoutes.get("/getUser", getUser);
userRoutes.get("/getUserByID/:id", getUserById);
userRoutes.get("/getUserByIDQuery", getUserByIdQuery);
export default userRoutes;
