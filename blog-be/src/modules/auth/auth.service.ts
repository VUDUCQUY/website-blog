import bcrypt from 'bcrypt';
import { InternalServerException, UnauthorizedException } from '@/common/utils/app-error';
import { IAuthRepository } from './auth.repository';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { Logger } from 'winston';
export class AuthService {
   constructor(
      private readonly authRepository: IAuthRepository,
      private readonly logger: Logger,
   ) { }

   async register(body: SignUpDto) {
      const { name, email, password, confirmPassword } = body;

      if (password !== confirmPassword) {
         throw new UnauthorizedException("Passwords do not match");
      }

      const existingUser = await this.authRepository.findUserByEmail(email);

      if (existingUser) {
         throw new UnauthorizedException("User with this email already exists");
      }

      try {
         const hashedPassword = await bcrypt.hash(password, 10);

         return await this.authRepository.createUser({
            name,
            email,
            password: hashedPassword,
         });
      } catch (error) {
         throw new InternalServerException("Failed to register user");
      }
   }

   async login(body: SignInDto) {
      const { email, password } = body;

      try {
         const user = await this.authRepository.findUserByEmail(email);

         if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException("Invalid email or password");
         }

         return await this.authRepository.updateLastLogin(user.id, new Date());
      } catch (error) {
         if (error instanceof UnauthorizedException) {
            throw error;
         }

         throw new InternalServerException("Failed to login");
      }
   }
}



