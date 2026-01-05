import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/create-login-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        phone: string;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        name: string;
        phone: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, data: UpdateUserDto): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        name: string;
        phone: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: number): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        name: string;
        phone: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    loginOrSignup(data: LoginUserDto): Promise<{
        id: number;
        name: string;
        phone: string;
    }>;
}
