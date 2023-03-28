import { Injectable } from '@nestjs/common';
import { CreateSpecServiceDto } from './dto/create-spec_service.dto';
import { UpdateSpecServiceDto } from './dto/update-spec_service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SpecService, SpecServiceDocument } from './schema/spec_service.schema';
import { Model } from 'mongoose';
import { SpecialistService } from '../specialist/specialist.service';
import { Specialist, SpecialistDocument } from '../specialist/schema/specialist.shcema';


@Injectable()
export class SpecServiceService {
  constructor(@InjectModel(SpecService.name) private specServiceModel: Model<SpecServiceDocument>,
  @InjectModel(Specialist.name) private specialistModel: Model<SpecialistDocument>) {}

  async create(createSpecServiceDto: CreateSpecServiceDto) {
    const newSpecService = new this.specServiceModel({
      ...CreateSpecServiceDto});
    const spec = await this.specialistModel.findById(createSpecServiceDto.specId)
    spec.services.push(newSpecService._id.toString());
    spec.save()
    return newSpecService.save();
  };

  findAll() {
    return this.specServiceModel.find().populate('specId').populate('serviceId');
  };

  findOne(id: string) {
    return this.specServiceModel.findById(id);
  };

  update(id: string, updateSpecServiceDto: UpdateSpecServiceDto) {
    return this.specServiceModel.findByIdAndUpdate(id, updateSpecServiceDto, {new: true});
  };

  remove(id: string) {
    return this.specServiceModel.findByIdAndDelete(id);
  };
}
