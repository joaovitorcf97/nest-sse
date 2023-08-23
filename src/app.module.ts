import { Module } from '@nestjs/common';
import { ReportsModule } from './reports/reports.module';
import { PrismaModule } from './prisma/prisma.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ReportsModule,
    PrismaModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
