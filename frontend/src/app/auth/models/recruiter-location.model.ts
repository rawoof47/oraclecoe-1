import { Region } from './region.model';
import { Country } from './country.model';

export interface RecruiterLocation {
  id: string;
  recruiter_profile_id: string;
  region_id: string;
  country_id?: string | null;
  region?: Region;
  country?: Country;
  created_at: string;
  updated_at: string;
}
