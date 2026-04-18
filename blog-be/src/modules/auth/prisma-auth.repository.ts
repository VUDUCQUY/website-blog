import { PrismaClient, User } from "@prisma/client";
import { IAuthRepository } from "./auth.repository";
import { SignUpDto } from "./dto/signup.dto";
import { Logger } from "winston";

export class PrismaAuthRepository implements IAuthRepository {

    constructor(
        private readonly prisma: PrismaClient,
        private readonly logger: Logger,
    ) { }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                email, isDeleted: false,
                isActive: true,
            }
        });
    }

    async createUser(data: SignUpDto): Promise<User> {
        this.logger.info("Creating user in repository", data);
        return this.prisma.user.create({ data: { name: data.name, email: data.email, password: data.password } });
    }
}