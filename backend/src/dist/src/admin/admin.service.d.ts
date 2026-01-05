import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AdminService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    createAdmin(email: string, password: string): Promise<{
        id: number;
        email: string;
        password: string;
    }>;
    login(email: string, password: string): Promise<{
        token: string;
        admin: {
            id: number;
            email: string;
        };
    }>;
    deleteAdmin(id: number): Promise<{
        message: string;
    }>;
    getAllAdmins(): Promise<{
        id: number;
        email: string;
    }[]>;
}
