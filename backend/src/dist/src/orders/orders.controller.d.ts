import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(data: CreateOrderDto): Promise<{
        service: {
            id: number;
            title: string;
            description: string;
            category: string;
            price: number;
            rating: number;
            image: string;
            available: boolean;
            features: string[];
        };
        user: {
            id: number;
            name: string;
            phone: string;
        };
    } & {
        quantity: number;
        total: number;
        date: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        serviceId: number;
        userId: number;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        service: {
            id: number;
            title: string;
            description: string;
            category: string;
            price: number;
            rating: number;
            image: string;
            available: boolean;
            features: string[];
        };
        user: {
            id: number;
            name: string;
            phone: string;
        };
    } & {
        quantity: number;
        total: number;
        date: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        serviceId: number;
        userId: number;
    })[]>;
    findAllByUser(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
        service: {
            id: number;
            title: string;
            description: string;
            category: string;
            price: number;
            rating: number;
            image: string;
            available: boolean;
            features: string[];
        };
        user: {
            id: number;
            name: string;
            phone: string;
        };
    } & {
        quantity: number;
        total: number;
        date: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        serviceId: number;
        userId: number;
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__OrderClient<({
        service: {
            id: number;
            title: string;
            description: string;
            category: string;
            price: number;
            rating: number;
            image: string;
            available: boolean;
            features: string[];
        };
        user: {
            id: number;
            name: string;
            phone: string;
        };
    } & {
        quantity: number;
        total: number;
        date: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        serviceId: number;
        userId: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: UpdateOrderDto): import(".prisma/client").Prisma.Prisma__OrderClient<{
        quantity: number;
        total: number;
        date: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        serviceId: number;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PAID'): Promise<{
        quantity: number;
        total: number;
        date: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        serviceId: number;
        userId: number;
    }>;
    delete(id: string): import(".prisma/client").Prisma.Prisma__OrderClient<{
        quantity: number;
        total: number;
        date: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        serviceId: number;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
