import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { ServicesService } from './services.service';
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
        let publicId = null;

        if (file) {
            const upload = await this.cloudinaryService.uploadImage(file);
            imageUrl = upload.secure_url;
            publicId = upload.public_id;
        } else if (imageUrl.startsWith('data:image')) {
            try {
                const upload = await new Promise((resolve, reject) => {
                    require('cloudinary').v2.uploader.upload(imageUrl, (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    });
                });
                imageUrl = (upload as any).secure_url;
                publicId = (upload as any).public_id;
            } catch (e) {
                console.error('Failed to upload base64 image to Cloudinary:', e);
            }
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
            throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
        }

        let imageUrl = body.image || (existingService as any).image;
        let publicId = (existingService as any).cloudinaryPublicId;

        if (file) {
            if ((existingService as any).cloudinaryPublicId) {
                try {
                    await this.cloudinaryService.deleteImage((existingService as any).cloudinaryPublicId);
                } catch (e) {
                    console.error('Failed to delete old image from Cloudinary:', e);
                }
            }

            const upload = await this.cloudinaryService.uploadImage(file);
            imageUrl = upload.secure_url;
            publicId = upload.public_id;
        } else if (body.image && body.image.startsWith('data:image')) {
            if ((existingService as any).cloudinaryPublicId) {
                try {
                    await this.cloudinaryService.deleteImage((existingService as any).cloudinaryPublicId);
                } catch (e) {
                    console.error('Failed to delete old image from Cloudinary:', e);
                }
            }

            try {
                const upload = await new Promise((resolve, reject) => {
                    require('cloudinary').v2.uploader.upload(body.image, (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    });
                });
                imageUrl = (upload as any).secure_url;
                publicId = (upload as any).public_id;
            } catch (e) {
                console.error('Failed to upload base64 image to Cloudinary during update:', e);
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

        return this.servicesService.update(Number(id), data);
    }


    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            const serviceId = Number(id);
            if (isNaN(serviceId) || serviceId <= 0) {
                throw new HttpException('Invalid service ID', HttpStatus.BAD_REQUEST);
            }

            const service = await this.servicesService.findOne(serviceId);
            if ((service as any)?.cloudinaryPublicId) {
                try {
                    await this.cloudinaryService.deleteImage((service as any).cloudinaryPublicId);
                } catch (e) {
                    console.error('Failed to delete image from Cloudinary during service deletion:', e);
                }
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