import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Service, ServiceDocument } from './schema/service.schema';
import { Model } from 'mongoose';


@Injectable()
export class ServiceService {
  constructor(@InjectModel(Service.name) private serviceModel: Model<ServiceDocument>) {}

  create(createServiceDto: CreateServiceDto) {
    const newService = new this.serviceModel({
      ...createServiceDto
    })
    return newService.save();
  }

  findAll() {
    return this.serviceModel.find();
  }

  findOne(id: string) {
    return this.serviceModel.findById(id).exec();
  }

  update(id: string, updateServiceDto: UpdateServiceDto) {
    return this.serviceModel.findByIdAndUpdate(id, updateServiceDto, {new: true});
  }

  remove(id: string) {
    return this.serviceModel.findByIdAndDelete(id);
  }
}
