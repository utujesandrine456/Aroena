import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateServiceDto): import(".prisma/client").Prisma.Prisma__ServiceClient<{
        title: string;
        description: string;
        category: string;
        price: number;
        rating: number;
        image: string;
        available: boolean;
        features: string[];
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        title: string;
        description: string;
        category: string;
        price: number;
        rating: number;
        image: string;
        available: boolean;
        features: string[];
        id: number;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__ServiceClient<{
        title: string;
        description: string;
        category: string;
        price: number;
        rating: number;
        image: string;
        available: boolean;
        features: string[];
        id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, data: UpdateServiceDto): import(".prisma/client").Prisma.Prisma__ServiceClient<{
        title: string;
        description: string;
        category: string;
        price: number;
        rating: number;
        image: string;
        available: boolean;
        features: string[];
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: number): import(".prisma/client").Prisma.Prisma__ServiceClient<{
        title: string;
        description: string;
        category: string;
        price: number;
        rating: number;
        image: string;
        available: boolean;
        features: string[];
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
