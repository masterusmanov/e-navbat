import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateSpecWorkingDayDto } from './dto/create-spec_working_day.dto';
import { UpdateSpecWorkingDayDto } from './dto/update-spec_working_day.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SpecWorkingDay, SpecWorkingDayDocument } from './schema/spec_working_day.schema';
import { Model } from 'mongoose';
import { Specialist, SpecialistDocument } from '../specialist/schema/specialist.shcema';

@Injectable()
export class SpecWorkingDayService {
  constructor(@InjectModel(SpecWorkingDay.name) private specWorkingModel: Model<SpecWorkingDayDocument>,
  @InjectModel(Specialist.name) private specialistModel: Model<SpecialistDocument>
  ) {}

  async create(createSpecWorkingDayDto: CreateSpecWorkingDayDto) {
    const existDay = await this.specWorkingModel.findOne({spec_id: createSpecWorkingDayDto.specId, dayOfWeek: createSpecWorkingDayDto.dayOfWeek});
    if(existDay){
      throw new BadRequestException('Working day already exists');
    }
    const workingDay = await this.specWorkingModel.create(createSpecWorkingDayDto)
    const spec = await this.specialistModel.findById(createSpecWorkingDayDto.specId)

    spec.working_day.push(workingDay._id.toString());
    spec.save()
    return workingDay;
  }

  async findAll() {
    return await this.specWorkingModel.find().populate('specialistId')
  }

  findOne(id: string) {
    return this.specWorkingModel.findById(id);
  }

  update(id: string, updateSpecWorkingDayDto: UpdateSpecWorkingDayDto) {
    return this.specWorkingModel.findByIdAndUpdate(id, updateSpecWorkingDayDto, {new: true});
  }

  remove(id: string) {
    return this.specWorkingModel.findByIdAndDelete(id);
  }
}
