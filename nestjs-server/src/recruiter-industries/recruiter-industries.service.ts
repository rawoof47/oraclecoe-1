import { Injectable } from '@nestjs/common';
import { CreateRecruiterIndustryDto } from './dto/create-recruiter-industry.dto';
import { UpdateRecruiterIndustryDto } from './dto/update-recruiter-industry.dto';

@Injectable()
export class RecruiterIndustriesService {
  create(createRecruiterIndustryDto: CreateRecruiterIndustryDto) {
    return 'This action adds a new recruiterIndustry';
  }

  findAll() {
    return `This action returns all recruiterIndustries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recruiterIndustry`;
  }

  update(id: number, updateRecruiterIndustryDto: UpdateRecruiterIndustryDto) {
    return `This action updates a #${id} recruiterIndustry`;
  }

  remove(id: number) {
    return `This action removes a #${id} recruiterIndustry`;
  }
}
