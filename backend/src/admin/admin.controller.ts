import { Controller, Post, Body, Res, Req, Param, Delete, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/admin/jwt-auth.guard';
import type { Request, Response } from 'express';


@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService){}

    @Post('create')
    createAdmin(@Body() body: {email: string; password: string }) {
        return this.adminService.createAdmin(body.email, body.password);
    }

    @Post('login')
    login(@Body() body: {email: string; password: string }){
        return this.adminService.login(body.email, body.password);
    }

    @Delete(':id')
    deleteAdmin(@Param('id') id:string){
        return this.adminService.deleteAdmin(parseInt(id, 10));
    }

    @Post('logout/:id')
    async logout(@Param('id') id:string, @Req() req: Request, @Res() res: Response){
        return res.status(200).json({ message: `Logged out user ${id} successfully` });
    }

    @Get()
    getAllAdmins(){
        return this.adminService.getAllAdmins();
    }
}
