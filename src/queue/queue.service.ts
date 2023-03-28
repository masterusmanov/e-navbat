import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Queue, QueueDocument } from './schema/queue.schema';
import { Model } from 'mongoose';
import { SpecService, SpecServiceDocument } from '../spec_service/schema/spec_service.schema';
import { SpecWorkingDay, SpecWorkingDayDocument } from '../spec_working_day/schema/spec_working_day.schema';
import { Client, ClientDocument } from '../client/schema/client.schema';


@Injectable()
export class QueueService {
  constructor(@InjectModel(Queue.name) private queueModel: Model<QueueDocument>,
  @InjectModel(SpecService.name) private specServiceModel: Model<SpecServiceDocument>,
  @InjectModel(SpecWorkingDay.name) private specWorkingDayModel: Model<SpecWorkingDayDocument>,
  @InjectModel(Client.name) private clientModel: Model<ClientDocument>) {}

  async create(createQueueDto: CreateQueueDto) {
    const {specServiceId, clientId, queueDataTime} = createQueueDto;
    const day = new Date(queueDataTime);
    const service = await this.specServiceModel.findById(specServiceId);

    const workingDay = await this.specWorkingDayModel.findOne({spec_id: service.specId.toString(), dayOfWeek: day.getDay()})
    
    if(!workingDay){
      throw new BadRequestException("not working day")
    }
    const queueNumber = await this.queueModel.count({specServiceId, queueDataTime});
    const newQueue = await this.queueModel.create({specServiceId, clientId, queueNumber: queueNumber + 1, queueDataTime})
    service.queues.push(newQueue._id.toString());
    service.save()
    const client = await this.clientModel.findById(clientId)
    client.queues.push(newQueue._id.toString())
    client.save()
    return newQueue;
  }

  findAll() {
    return this.queueModel.find().populate('specServiceId').populate('clientId');
  }

  findOne(id: string) {
    return this.queueModel.findById(id).populate('specServiceId').populate('clientId');
  }

  update(id: string, updateQueueDto: UpdateQueueDto) {
    return this.queueModel.findByIdAndUpdate(id, updateQueueDto, {new: true}).populate('specServiceId').populate('clientId');
  }

  remove(id: string) {
    return this.queueModel.findByIdAndDelete(id);
  }
}
