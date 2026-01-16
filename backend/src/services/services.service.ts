import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';


@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateServiceDto) {
    return this.prisma.service.create({ data });
  }

  findAll() {
    return this.prisma.service.findMany();
  }

  findOne(id: number) {
    return this.prisma.service.findUnique({
      where: { id },
    });
  }

  update(id: number, data: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    try {
      // Check if service exists first
      const service = await this.prisma.service.findUnique({
        where: { id },
        include: {
          orders: true,
        },
      });
      
      if (!service) {
        throw new NotFoundException('Service not found');
      }
      
      // Check if service has associated orders
      if (service.orders && service.orders.length > 0) {
        throw new BadRequestException(
          `Cannot delete service: It has ${service.orders.length} associated order(s). Please delete or reassign the orders first.`
        );
      }
      
      // Delete the service
      return await this.prisma.service.delete({
        where: { id },
      });
    } catch (error: any) {
      // If it's already a NestJS exception, re-throw it
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      // Handle Prisma errors
      if (error.code === 'P2003') {
        throw new BadRequestException('Cannot delete service: It is associated with existing orders');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Service not found');
      }
      
      // Log the error for debugging
      console.error('Error deleting service:', error);
      
      // For any other error, throw a generic bad request with the error message
      const errorMessage = error?.message || 'Failed to delete service';
      throw new BadRequestException(errorMessage);
    }
  }
}
