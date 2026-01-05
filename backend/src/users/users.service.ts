import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/create-login-user.dto';





@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
    ) { }

    findAll() {
        return this.prisma.user.findMany();
    }

    findOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    update(id: number, data: UpdateUserDto) {
        return this.prisma.user.update({ where: { id }, data, });
    }

    delete(id: number) {
        return this.prisma.user.delete({ where: { id }, });
    }

    async loginOrSignup(data: LoginUserDto) {
        let user = await this.prisma.user.findUnique({ where: { phone: data.phone }, });

        if (!user) {
            user = await this.prisma.user.create({ data });
        }

        return user;
    }
}

