import { Router } from "express";
import { AuthController } from "@/modules/auth/application/auth.controller";
import { AuthService } from "@/modules/auth/application/auth.service";
import { passportAuthenticateJwt } from "@/config/passport.config";
import { PrismaAuthRepository } from "@/modules/auth/infracstructure/prisma-auth.repository";


const authRouter = Router();
const authRepository = new PrismaAuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

authRouter.post(
  "/register",
  authController.register.bind(authController)
);

authRouter.post(
  "/login",
  authController.login.bind(authController)
);

authRouter.post(
  "/logout",
  passportAuthenticateJwt,
  authController.logout.bind(authController)
);

authRouter.get(
  "/status",
  passportAuthenticateJwt,
  authController.authStatus.bind(authController)
);

export default authRouter;