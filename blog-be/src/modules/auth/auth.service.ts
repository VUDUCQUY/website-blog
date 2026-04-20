import bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@/common/utils/app-error';
import { IAuthRepository } from './auth.repository';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { Logger } from 'winston';
export class AuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly logger: Logger,
  ) {}

  async register(body: SignUpDto) {
    try{
      const { name, email, password } = body;

    const existingUser = await this.authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.authRepository.createUser({
      name,
      email,
      password: hashedPassword,
    });

    return newUser;
    }
      catch (error) {
        if (error instanceof Error) {
          throw error;
        }
      throw new BadRequestException('Registration failed');
    }
  }

  async login(body: SignInDto) {
   try{
      const { email, password } = body;

      const user = await this.authRepository.findUserByEmail(email);

      if (!user) {
         throw new UnauthorizedException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
         throw new UnauthorizedException('User not found');
      }

      return user;
  }
   catch (error) {
      if (error instanceof Error) {
         throw error;
      }
      throw new BadRequestException('Login failed');
   }
  }
}
