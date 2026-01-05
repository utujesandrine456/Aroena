import { AdminService } from './admin.service';
import type { Request, Response } from 'express';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    createAdmin(body: {
        email: string;
        password: string;
    }): Promise<{
        id: number;
        email: string;
        password: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        admin: {
            id: number;
            email: string;
        };
    }>;
    deleteAdmin(id: string): Promise<{
        message: string;
    }>;
    logout(id: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllAdmins(): Promise<{
        id: number;
        email: string;
    }[]>;
}
