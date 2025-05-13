import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateProfile } from './entities/candidate-profile.entity'; // Correct import path
import { CreateCandidateProfileDto } from './dto/create-candidate-profile.dto'; // Assuming DTO is located in the dto folder
import { UpdateCandidateProfileDto } from './dto/update-candidate-profile.dto'; // Assuming DTO is located in the dto folder

@Injectable()
export class CandidateProfilesService {
  constructor(
    @InjectRepository(CandidateProfile)
    private readonly candidateProfileRepository: Repository<CandidateProfile>,
  ) {}

  // Create a new candidate profile
  async create(createCandidateProfileDto: CreateCandidateProfileDto) {
    const candidateProfile = this.candidateProfileRepository.create(createCandidateProfileDto);
    return this.candidateProfileRepository.save(candidateProfile);
  }

  // Get all candidate profiles
  findAll() {
    return this.candidateProfileRepository.find();
  }

  // Get a specific candidate profile by ID
  async findOne(id: string) {
    const profile = await this.candidateProfileRepository.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException('Candidate profile not found');
    }
    return profile;
  }

  // Update a candidate profile
  async update(id: string, updateCandidateProfileDto: UpdateCandidateProfileDto) {
    const profile = await this.candidateProfileRepository.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException('Candidate profile not found');
    }

    // Update fields
    Object.assign(profile, updateCandidateProfileDto);

    return this.candidateProfileRepository.save(profile);
  }

  // Delete a candidate profile
  async remove(id: string) {
    const profile = await this.candidateProfileRepository.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException('Candidate profile not found');
    }

    return this.candidateProfileRepository.remove(profile);
  }
}
