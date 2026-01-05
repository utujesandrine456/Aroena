import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/create-login-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    loginOrSignup(data: LoginUserDto): Promise<{
        id: number;
        name: string;
        phone: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        phone: string;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        name: string;
        phone: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: UpdateUserDto): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        name: string;
        phone: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        name: string;
        phone: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
