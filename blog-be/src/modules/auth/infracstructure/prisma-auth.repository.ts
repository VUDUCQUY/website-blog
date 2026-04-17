import { PrismaClient, User } from "@prisma/client";
import { IAuthRepository } from "../domain/auth.repository";
import { Logger } from "winston";
import { SignUpDto } from "../dto/signup.dto";

export class PrismaAuthRepository implements IAuthRepository {
 
    constructor(
        private readonly prisma: PrismaClient,
        private logger: Logger,
    ) {}

    async findUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email,isDeleted: false,
         isActive: true, } });
    }

    async createUser(data: SignUpDto): Promise<User> {
        return this.prisma.user.create({ data: {name: data.name, email: data.email, password: data.password} });
    }
}