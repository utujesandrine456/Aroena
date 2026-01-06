import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/auth/admin/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import type { Express } from 'express';


@Controller('services')
export class ServicesController {
    constructor(
        private readonly servicesService: ServicesService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @Body() body: any,
        @UploadedFile() file: Express.Multer.File,
    ) {
        let imageUrl = body.image || '';

        if (file) {
            const upload = await this.cloudinaryService.uploadImage(file);
            imageUrl = upload.secure_url;
        }

        const data = {
            ...body,
            price: Number(body.price),
            rating: Number(body.rating || 0),
            available: body.available === 'true',
            features: JSON.parse(body.features || '[]'),
            image: imageUrl,
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
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Param('id') id: string,
        @Body() body: any,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const existingService = await this.servicesService.findOne(Number(id));
        if (!existingService) {
            throw new Error('Service not found');
        }

        let imageUrl = body.image || existingService.image;

        if (file) {
            const upload = await this.cloudinaryService.uploadImage(file);
            imageUrl = upload.secure_url;
        }

        const data = {
            ...body,
            price: body.price ? Number(body.price) : undefined,
            rating: body.rating ? Number(body.rating) : undefined,
            available: body.available !== undefined ? body.available === 'true' : undefined,
            features: body.features ? JSON.parse(body.features) : undefined,
            image: imageUrl,
        };

        return this.servicesService.update(Number(id), data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.servicesService.delete(Number(id));
    }
}
