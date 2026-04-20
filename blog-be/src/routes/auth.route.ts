import { Router } from 'express';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { passportAuthenticateJwt } from '@/config/passport.config';
import { PrismaAuthRepository } from '@/modules/auth/prisma-auth.repository';
import prisma from '@/lib/prisma';
import { Logger, loggers, transports, format } from 'winston';

loggers.add('auth', {
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
});
const logger = loggers.get('auth') as Logger;
const authRouter = Router();
const authRepository = new PrismaAuthRepository(prisma, logger);
const authService = new AuthService(authRepository, logger);
const authController = new AuthController(authService, logger);

authRouter.post('/register', authController.register.bind(authController));

authRouter.post('/login', authController.login.bind(authController));

authRouter.post('/logout', passportAuthenticateJwt, authController.logout.bind(authController));

authRouter.get('/status', passportAuthenticateJwt, authController.authStatus.bind(authController));

export default authRouter;
