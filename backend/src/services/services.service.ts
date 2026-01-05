import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';


@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateServiceDto) {
    return this.prisma.service.create({ data });
  }

  findAll() {
    return this.prisma.service.findMany();
  }

  findOne(id: number) {
    return this.prisma.service.findUnique({
      where: { id },
    });
  }

  update(id: number, data: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  delete(id: number) {
    return this.prisma.service.delete({
      where: { id },
    });
  }
}
