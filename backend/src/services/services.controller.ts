import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/auth/admin/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';


@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads/services',
            filename: (_, file, cb) => {
                const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${name}${extname(file.originalname)}`);
            },
        }),
    }))
    async create(
        @Body() body: any,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const data = {
            ...body,
            price: Number(body.price),
            rating: Number(body.rating || 0),
            available: body.available === 'true',
            features: JSON.parse(body.features || '[]'),
            image: `/uploads/services/${file.filename}`,
        };

        return this.servicesService.create(data);
    }



    @Get()
    findAll() {
        return this.servicesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.servicesService.findOne(Number(id));
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() data: UpdateServiceDto) {
        return this.servicesService.update(Number(id), data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.servicesService.delete(Number(id));
    }
}
