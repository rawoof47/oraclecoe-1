import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Country } from './country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async searchCountries(regionId: string, keyword: string): Promise<Country[]> {
    return this.countryRepository.find({
      where: {
        region_id: regionId,
        name: ILike(`%${keyword}%`),
      },
      order: { name: 'ASC' },
      take: 10,
    });
  }
}
