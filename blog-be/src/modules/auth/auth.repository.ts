import { User } from "@prisma/client";
import { SignUpDto } from "./dto/signup.dto";

export interface IAuthRepository {
    findUserByEmail(email: string): Promise<User | null>;
    createUser(data: SignUpDto): Promise<User>;
}