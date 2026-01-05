import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ServicesModule, OrdersModule, PrismaModule, UsersModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
