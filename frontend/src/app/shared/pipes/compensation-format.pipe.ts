import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'compensationFormat',
  standalone: true
})
export class CompensationFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return 'Not specified';

    const formatAmount = (numStr: string): string => {
      const num = parseInt(numStr, 10);
      return isNaN(num) ? numStr : '₹' + num.toLocaleString('en-IN');
    };

    if (value.startsWith('<')) {
      return '< ' + formatAmount(value.substring(1));
    }

    if (value.startsWith('>')) {
      return '> ' + formatAmount(value.substring(1));
    }

    const parts = value.split('-');
    if (parts.length === 2) {
      return `${formatAmount(parts[0])} - ${formatAmount(parts[1])}`;
    }

    return formatAmount(value);
  }
}
