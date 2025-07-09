import { Controller, Get, Param, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Country } from './country.entity';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get('search')
  async search(
    @Query('regionId') regionId: string,
    @Query('keyword') keyword: string,
  ): Promise<Country[]> {
    if (!regionId || !keyword) {
      return [];
    }

    return this.countriesService.searchCountries(regionId, keyword);
  }

  // ✅ Newly added
  @Get('by-region/:regionId')
  async getCountriesByRegion(
    @Param('regionId') regionId: string,
  ): Promise<Country[]> {
    return this.countriesService.findByRegion(regionId);
  }
}
