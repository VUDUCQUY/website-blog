import bcrypt from 'bcrypt';
import { UnauthorizedException } from '@/common/utils/app-error';
import { IAuthRepository } from '../domain/auth.repository';
import { SignUpDto } from '../dto/signup.dto';
import { SignInDto } from '../dto/signin.dto';
export class AuthService {
   constructor(
      private readonly authRepository: IAuthRepository,
   ) {}

   async register(body: SignUpDto) {
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



