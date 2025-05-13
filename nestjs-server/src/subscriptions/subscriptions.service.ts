import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
  ) {}

  create(dto: CreateSubscriptionDto) {
    const subscription = this.subscriptionRepo.create(dto);
    return this.subscriptionRepo.save(subscription);
  }

  findAll() {
    return this.subscriptionRepo.find();
  }

  async findOne(id: string) {
    const subscription = await this.subscriptionRepo.findOne({ where: { id } });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    return subscription;
  }

  async update(id: string, dto: UpdateSubscriptionDto) {
    const subscription = await this.findOne(id);
    const updated = Object.assign(subscription, dto);
    return this.subscriptionRepo.save(updated);
  }

  async remove(id: string) {
    const subscription = await this.findOne(id);
    return this.subscriptionRepo.remove(subscription);
  }
}
