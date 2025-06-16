import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecruiterProfile } from './entities/recruiter-profile.entity';
import { CreateRecruiterProfileDto } from './dto/create-recruiter-profile.dto';
import { UpdateRecruiterProfileDto } from './dto/update-recruiter-profile.dto';

@Injectable()
export class RecruiterProfilesService {
  constructor(
    @InjectRepository(RecruiterProfile)
    private recruiterRepo: Repository<RecruiterProfile>,
  ) {}

  create(createDto: CreateRecruiterProfileDto, userId: string) {
    const profile = this.recruiterRepo.create({
      ...createDto,
      user_id: userId,
      created_by: userId,
      updated_by: userId,
    });
    return this.recruiterRepo.save(profile);
  }

  findAll() {
    return this.recruiterRepo.find();
  }

  findOne(id: string) {
    return this.recruiterRepo.findOneBy({ id });
  }

  update(id: string, updateDto: UpdateRecruiterProfileDto) {
    return this.recruiterRepo.update(id, updateDto);
  }

  remove(id: string) {
    return this.recruiterRepo.delete(id);
  }
}
