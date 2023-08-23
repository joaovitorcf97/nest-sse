import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('reports')
    private reportsQueue: Queue,
  ) {}

  async all() {
    return this.prisma.report.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.report.findUnique({
      where: {
        id,
      },
    });
  }

  async request() {
    const report = await this.prisma.report.create({
      data: {
        status: Status.PENDING,
      },
    });
    await this.reportsQueue.add({ reportId: report.id });

    return report;
  }

  async produce(reportId: number) {
    console.log('produce method');
    await sleep(Math.random() * 10000);
    await this.prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        status: Status.PROCESSING,
      },
    });
    await sleep(Math.random() * 10000);
    const randomStatus = Math.random() > 0.5 ? Status.DONE : Status.ERROR;
    await this.prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        filename:
          randomStatus === Status.DONE ? `report-${reportId}.pdf` : null,
        status: randomStatus,
      },
    });
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
