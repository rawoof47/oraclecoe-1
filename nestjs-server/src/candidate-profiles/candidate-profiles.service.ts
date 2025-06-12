import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { CreateCandidateProfileDto } from './dto/create-candidate-profile.dto';
import { UpdateCandidateProfileDto } from './dto/update-candidate-profile.dto';
import { Status } from 'src/statuses/entities/status.entity';

@Injectable()
export class CandidateProfilesService {
  constructor(
    @InjectRepository(CandidateProfile)
    private readonly candidateProfileRepository: Repository<CandidateProfile>,

    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  // 🎯 Create or Update candidate profile if it exists (Upsert)
  async create(
    createCandidateProfileDto: CreateCandidateProfileDto,
    userId: string,
  ): Promise<CandidateProfile> {
    console.log('🔧 [UPSERT] Starting candidate profile process...');
    console.log('👤 User ID:', userId);
    console.log('📦 Payload:', createCandidateProfileDto);

    try {
      const existingProfile = await this.candidateProfileRepository.findOne({
        where: { user_id: userId },
      });

      if (existingProfile) {
        console.log(`✏️ Profile already exists for user ID: ${userId}. Updating...`);
        Object.assign(existingProfile, createCandidateProfileDto, {
          updated_by: userId,
        });

        const updatedProfile = await this.candidateProfileRepository.save(existingProfile);
        console.log('✅ Profile updated successfully:', updatedProfile);
        return updatedProfile;
      }

      const status = await this.statusRepository.findOne({
        where: { status_name: 'Profile Submitted' },
      });

      if (!status) {
        console.error('❌ Status "Profile Submitted" not found');
        throw new NotFoundException('Default status "Profile Submitted" not found.');
      }

      const newProfile = this.candidateProfileRepository.create({
        ...createCandidateProfileDto,
        user_id: userId,
        status_id: status.id,
        created_by: userId,
        updated_by: userId,
      });

      const savedProfile = await this.candidateProfileRepository.save(newProfile);
      console.log('✅ New candidate profile created:', savedProfile);
      return savedProfile;

    } catch (error) {
      console.error('❌ Error during candidate profile upsert:', error);
      throw new InternalServerErrorException('Failed to create or update candidate profile.');
    }
  }

  // 🔍 Get all candidate profiles
  async findAll(): Promise<CandidateProfile[]> {
    console.log('🔍 [FIND ALL] Fetching all candidate profiles...');
    try {
      const profiles = await this.candidateProfileRepository.find({
        relations: ['status'],
      });
      console.log(`✅ Found ${profiles.length} candidate profiles.`);
      return profiles;
    } catch (error) {
      console.error('❌ Error fetching candidate profiles:', error);
      throw new InternalServerErrorException(
        'Failed to fetch candidate profiles.',
      );
    }
  }

  // 🔍 Get a specific candidate profile by ID
  async findOne(id: string): Promise<CandidateProfile> {
    console.log(`🔍 [FIND ONE] Fetching profile with ID: ${id}`);
    try {
      const profile = await this.candidateProfileRepository.findOne({
        where: { id },
        relations: ['status'],
      });

      if (!profile) {
        console.warn(`⚠️ Profile with ID ${id} not found.`);
        throw new NotFoundException('Candidate profile not found.');
      }

      console.log('✅ Found profile:', profile);
      return profile;
    } catch (error) {
      console.error(`❌ Error fetching profile with ID ${id}:`, error);
      throw error;
    }
  }

  // ✏️ Update a candidate profile and set updated_by
  async update(
    id: string,
    updateCandidateProfileDto: UpdateCandidateProfileDto,
    userId: string,
  ): Promise<CandidateProfile> {
    console.log(`✏️ [UPDATE] Updating profile ID: ${id}`);
    console.log('👤 Updater ID:', userId);
    console.log('📦 Update Data:', updateCandidateProfileDto);

    try {
      const profile = await this.candidateProfileRepository.findOne({
        where: { id },
      });

      if (!profile) {
        console.warn(`⚠️ Profile with ID ${id} not found for update.`);
        throw new NotFoundException('Candidate profile not found.');
      }

      Object.assign(profile, updateCandidateProfileDto, {
        updated_by: userId,
      });

      const updated = await this.candidateProfileRepository.save(profile);
      console.log('✅ Profile updated successfully:', updated);
      return updated;
    } catch (error) {
      console.error(`❌ Error updating profile with ID ${id}:`, error);
      throw new InternalServerErrorException(
        'Failed to update candidate profile.',
      );
    }
  }

  // ❌ Delete a candidate profile
  async remove(id: string): Promise<CandidateProfile> {
    console.log(`🗑️ [DELETE] Deleting profile with ID: ${id}`);
    try {
      const profile = await this.candidateProfileRepository.findOne({
        where: { id },
      });

      if (!profile) {
        console.warn(`⚠️ Profile with ID ${id} not found for deletion.`);
        throw new NotFoundException('Candidate profile not found.');
      }

      const removed = await this.candidateProfileRepository.remove(profile);
      console.log('✅ Profile deleted successfully:', removed);
      return removed;
    } catch (error) {
      console.error(`❌ Error deleting profile with ID ${id}:`, error);
      throw new InternalServerErrorException(
        'Failed to delete candidate profile.',
      );
    }
  }

  // ✅ Reusable method to upsert by updated_by
  async updateProfile(data: UpdateCandidateProfileDto) {
    let profile = await this.candidateProfileRepository.findOne({
      where: { created_by: data.updated_by },
    });

    if (!profile) {
      profile = this.candidateProfileRepository.create({
        created_by: data.updated_by,
        ...data,
      });
    } else {
      profile = this.candidateProfileRepository.merge(profile, data);
    }

    return await this.candidateProfileRepository.save(profile);
  }
}
