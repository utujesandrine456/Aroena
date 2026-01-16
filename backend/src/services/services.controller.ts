import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
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
        try {
            let imageUrl = body.image || '';

            // Upload to Cloudinary if file is provided
            if (file) {
                try {
                    const upload = await this.cloudinaryService.uploadImage(file);
                    imageUrl = upload.secure_url;
                } catch (uploadError: any) {
                    console.error('Cloudinary upload error:', uploadError);
                    throw new HttpException(
                        `Failed to upload image: ${uploadError?.message || 'Unknown error'}`,
                        HttpStatus.BAD_REQUEST
                    );
                }
            }

            // Validate required fields
            if (!body.title || !body.category || !body.price || !body.description) {
                throw new HttpException(
                    'Missing required fields: title, category, price, and description are required',
                    HttpStatus.BAD_REQUEST
                );
            }

            const data: any = {
                title: body.title,
                description: body.description,
                category: body.category,
                price: Number(body.price),
                rating: Number(body.rating || 0),
                available: body.available === 'true' || body.available === true,
                image: imageUrl,
            };

            // Parse features
            if (body.features) {
                try {
                    data.features = typeof body.features === 'string'
                        ? JSON.parse(body.features)
                        : body.features;
                } catch (e) {
                    console.warn('Failed to parse features JSON in create');
                    data.features = [];
                }
            } else {
                data.features = [];
            }

            return await this.servicesService.create(data);
        } catch (error: any) {
            console.error('Error creating service:', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                error?.message || 'Failed to create service',
                error?.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
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
        try {
            const serviceId = Number(id);
            if (isNaN(serviceId) || serviceId <= 0) {
                throw new HttpException('Invalid service ID', HttpStatus.BAD_REQUEST);
            }

            const existingService = await this.servicesService.findOne(serviceId);
            if (!existingService) {
                throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
            }

            let imageUrl = body.image || existingService.image;

            // Upload new image to Cloudinary if file is provided
            if (file) {
                try {
                    const upload = await this.cloudinaryService.uploadImage(file);
                    imageUrl = upload.secure_url;
                    
                    // Optionally delete old image from Cloudinary if it exists
                    // (You can extract public_id from existingService.image if needed)
                } catch (uploadError: any) {
                    console.error('Cloudinary upload error:', uploadError);
                    throw new HttpException(
                        `Failed to upload image: ${uploadError?.message || 'Unknown error'}`,
                        HttpStatus.BAD_REQUEST
                    );
                }
            }

            const data: any = {};

            if (body.title !== undefined) data.title = body.title;
            if (body.description !== undefined) data.description = body.description;
            if (body.category !== undefined) data.category = body.category;

            if (body.price !== undefined) {
                const priceNum = Number(body.price);
                if (!isNaN(priceNum)) data.price = priceNum;
            }

            if (body.rating !== undefined) {
                const ratingNum = Number(body.rating);
                if (!isNaN(ratingNum)) data.rating = ratingNum;
            }

            if (body.available !== undefined) {
                data.available = body.available === 'true' || body.available === true;
            }

            if (body.features !== undefined) {
                try {
                    data.features = typeof body.features === 'string'
                        ? JSON.parse(body.features)
                        : body.features;
                } catch (e) {
                    console.warn('Failed to parse features JSON, using as is');
                    data.features = body.features;
                }
            }

            data.image = imageUrl;
            delete (data as any).id;
            Object.keys(data).forEach(key => (data as any)[key] === undefined && delete (data as any)[key]);

            return await this.servicesService.update(serviceId, data);
        } catch (error: any) {
            console.error('Error updating service:', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                error?.message || 'Failed to update service',
                error?.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            const serviceId = Number(id);
            if (isNaN(serviceId) || serviceId <= 0) {
                throw new HttpException('Invalid service ID', HttpStatus.BAD_REQUEST);
            }
            return await this.servicesService.delete(serviceId);
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Unexpected error in delete controller:', error);
            throw new HttpException(
                error?.message || 'Internal server error',
                error?.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}