import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpecWorkingDayService } from './spec_working_day.service';
import { CreateSpecWorkingDayDto } from './dto/create-spec_working_day.dto';
import { UpdateSpecWorkingDayDto } from './dto/update-spec_working_day.dto';

@Controller('spec-working-day')
export class SpecWorkingDayController {
  constructor(private readonly specWorkingDayService: SpecWorkingDayService) {}

  @Post()
  create(@Body() createSpecWorkingDayDto: CreateSpecWorkingDayDto) {
    return this.specWorkingDayService.create(createSpecWorkingDayDto);
  }

  @Get()
  findAll() {
    return this.specWorkingDayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specWorkingDayService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecWorkingDayDto: UpdateSpecWorkingDayDto) {
    return this.specWorkingDayService.update(id, updateSpecWorkingDayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specWorkingDayService.remove(id);
  }
}
