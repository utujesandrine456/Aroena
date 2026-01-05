import { ServicesService } from './services.service';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(body: any, file: Express.Multer.File): Promise<{
        title: string;
        description: string;
        category: string;
        price: number;
        rating: number;
        image: string;
        available: boolean;
        features: string[];
        id: number;
    }>;
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
    findOne(id: string): import(".prisma/client").Prisma.Prisma__ServiceClient<{
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
    update(id: string, data: UpdateServiceDto): import(".prisma/client").Prisma.Prisma__ServiceClient<{
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
    delete(id: string): import(".prisma/client").Prisma.Prisma__ServiceClient<{
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
