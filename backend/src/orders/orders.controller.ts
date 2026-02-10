import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/admin/jwt-auth.guard';



@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Body() data: CreateOrderDto) {
        return this.ordersService.create(data);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        try {
            return await this.ordersService.findAll();
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw new HttpException(error.message || 'Failed to fetch orders', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('user/:userId')
    findAllByUser(@Param('userId') userId: string) {
        try {
            const id = Number(userId);
            if (isNaN(id)) {
                throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
            }
            return this.ordersService.findAllByUser(id);
        } catch (error) {
            console.error('Error fetching user orders:', error);
            throw new HttpException(
                error.message || 'Failed to fetch user orders',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(Number(id));
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: UpdateOrderDto) {
        return this.ordersService.update(Number(id), data);
    }

    @Put(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: 'APPROVED' | 'REJECTED' | 'PAID') {
        return this.ordersService.updateStatus(Number(id), status);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.ordersService.delete(Number(id));
    }
}
