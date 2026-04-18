import bcrypt from 'bcrypt';
import { UnauthorizedException } from '@/common/utils/app-error';
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
      this.logger.info("Registering user in service");
      const { name, email, password } = body;

      const existingUser = await this.authRepository.findUserByEmail(email);

      if (existingUser) {
         throw new UnauthorizedException("User with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.authRepository.createUser({
         name,
         email,
         password: hashedPassword,
      });

      return newUser;
   }
   async login(body: SignInDto) {
      this.logger.info("Logging in user in service");
      const { email, password } = body;

      const user = await this.authRepository.findUserByEmail(email);

      if (!user) {
         throw new UnauthorizedException("Invalid email or password");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
         throw new UnauthorizedException("Invalid email or password");
      }

      return user;
   };
}



