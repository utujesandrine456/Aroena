import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ){}

    async createAdmin(email: string, password: string) {
        const hashed = await bcrypt.hash(password, 10);
        return this.prisma.admin.create({
            data: { email, password: hashed },
        });
    }

    async login(email: string, password: string) {
        const admin = await this.prisma.admin.findUnique({ where: { email }});
        if (!admin) throw new UnauthorizedException('Invalid credentials');

        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');

        const token = this.jwtService.sign(
            { id: admin.id, email: admin.email },
            { expiresIn: '7d' }
        );

        return { token, admin: { id: admin.id, email: admin.email } };
    }

    async deleteAdmin(id: number) {
        const admin = await this.prisma.admin.findUnique({ where: { id }});
        if (!admin) throw new NotFoundException('Admin not found');

        await this.prisma.admin.delete({ where: { id }});
        return { message: 'Admin deleted successfully' };
    }

    async getAllAdmins(){
        return this.prisma.admin.findMany({
            select: {
                id: true,
                email: true,
            }
        })
    }
}
