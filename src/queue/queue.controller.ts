import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { JwtAdminGuard } from '../guards/admin.guard';
import { AdminSelfGuard } from '../guards/admin_self.guard';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @UseGuards(JwtAdminGuard)
  @Post()
  create(@Body() createQueueDto: CreateQueueDto) {
    return this.queueService.create(createQueueDto);
  }

  @UseGuards(JwtAdminGuard)
  @Get()
  findAll() {
    return this.queueService.findAll();
  }

  @UseGuards(AdminSelfGuard)
  @UseGuards(JwtAdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queueService.findOne(id);
  }

  @UseGuards(AdminSelfGuard)
  @UseGuards(JwtAdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQueueDto: UpdateQueueDto) {
    return this.queueService.update(id, updateQueueDto);
  }

  @UseGuards(JwtAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queueService.remove(id);
  }
}
