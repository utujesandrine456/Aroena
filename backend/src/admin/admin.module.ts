import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/admin/auth.module';


@Module({
  imports: [PrismaModule, AuthModule ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
