import { Controller, Get, Query } from '@nestjs/common';
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
}
