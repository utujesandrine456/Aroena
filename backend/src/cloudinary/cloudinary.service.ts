import { Injectable, OnModuleInit } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import toStream = require('streamifier');
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService implements OnModuleInit {
    onModuleInit() {
        // Trim whitespace from environment variables
        const cloudName = process.env.CLOUD_NAME?.trim();
        const apiKey = process.env.API_KEY?.trim();
        const apiSecret = process.env.API_SECRET?.trim();

        // Validate configuration
        if (!cloudName || !apiKey || !apiSecret) {
            console.error('⚠️  Cloudinary configuration missing!');
            console.error('Missing variables:', {
                CLOUD_NAME: !cloudName ? 'MISSING' : 'OK',
                API_KEY: !apiKey ? 'MISSING' : 'OK',
                API_SECRET: !apiSecret ? 'MISSING' : 'OK (hidden)',
            });
            return;
        }

        // Configure Cloudinary when module initializes
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });

        console.log('✅ Cloudinary configured successfully');
        console.log(`   Cloud Name: ${cloudName}`);
        console.log(`   API Key: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
    }

    async uploadImage(
        file: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        // Trim and validate environment variables
        const cloudName = process.env.CLOUD_NAME?.trim();
        const apiKey = process.env.API_KEY?.trim();
        const apiSecret = process.env.API_SECRET?.trim();

        // Ensure Cloudinary is configured before upload
        if (!cloudName || !apiKey || !apiSecret) {
            throw new Error('Cloudinary is not configured. Please set CLOUD_NAME, API_KEY, and API_SECRET environment variables.');
        }

        // Reconfigure to ensure fresh values (in case env vars changed)
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });

        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    folder: 'aroena-services', // Optional: organize uploads in a folder
                },
                (error, result) => {
                    if (error) {
                        // Provide more helpful error messages
                        if (error.http_code === 401) {
                            console.error('Cloudinary Authentication Error:', {
                                message: error.message,
                                http_code: error.http_code,
                                cloud_name: cloudName,
                                api_key_preview: `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`,
                            });
                            reject(new Error('Cloudinary authentication failed. Please verify your API_KEY and API_SECRET are correct and have no extra spaces.'));
                        } else {
                            reject(error);
                        }
                        return;
                    }
                    resolve(result!);
                },
            );

            toStream.createReadStream(file.buffer).pipe(upload);
        });
    }

    async deleteImage(publicId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }
}
