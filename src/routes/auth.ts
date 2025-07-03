import express from "express";
import { loginUser, checkUser } from "../controllers/auth";
import authenticate from "../middlewares/authenticate";

const auth = express.Router();

auth.get("/", authenticate, checkUser);
auth.post("/login", loginUser);

export default auth;
