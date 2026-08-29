import express from 'express';
import { Login, Register, GetMe, GoogleAuth, SetPassword } from '../Controllers/Auth.controller.js';
import { AuthMiddleware } from '../Controllers/Auth.controller.js';
const AuthRouter = express.Router();

AuthRouter.post('/login', Login);
AuthRouter.post('/register', Register);
AuthRouter.post('/google', GoogleAuth);
AuthRouter.get("/me", AuthMiddleware, GetMe);
AuthRouter.post("/set-password", AuthMiddleware, SetPassword);
export default AuthRouter;
