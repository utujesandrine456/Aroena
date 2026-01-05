import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';




@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateOrderDto) {
        const serviceId = Number(data.serviceId);
        const userId = Number(data.userId);

        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
        });

        if (!service) {
            throw new Error('Service not found');
        }

        return this.prisma.order.create({
            data: {
                ...data,
                serviceId,
                userId,
                status: 'PENDING'
            },
            include: {
                service: true,
                user: true
            }
        });
    }

    findAll() {
        return this.prisma.order.findMany({
            include: {
                service: true,
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    findAllByUser(userId: number) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                service: true,
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    findOne(id: number) {
        return this.prisma.order.findUnique({
            where: { id },
            include: {
                service: true,
                user: true
            }
        });
    }

    update(id: number, data: UpdateOrderDto) {
        return this.prisma.order.update({
            where: { id },
            data,
        })
    }

    async updateStatus(id: number, status: 'APPROVED' | 'REJECTED' | 'PAID') {
        return this.prisma.order.update({
            where: { id },
            data: { status }
        });
    }

    delete(id: number) {
        return this.prisma.order.delete({
            where: { id },
        })
    }
}

