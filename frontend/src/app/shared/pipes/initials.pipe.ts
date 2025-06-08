import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
  standalone: true
})
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '';

    // Get first letter of first name and last name (if exists)
    const initials = parts.length === 1
      ? parts[0][0]
      : parts[0][0] + parts[parts.length - 1][0];

    return initials.toUpperCase();
  }
}
