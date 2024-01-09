// filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], term: string): any[] {
    if (!items || !term) {
      return items;
    }

    return items.filter(item => {
      // Implement your own logic for filtering
      const prosumerUUIDs = (item.attributes?.prosumerUUID || []).map((uuid: string) => uuid.toLowerCase());
      const projectNames = (item.attributes?.projectName || []).map((name: string) => name.toLowerCase());
      const countryCodes = (item.attributes?.countryCode || []).map((code: string) => code.toLowerCase());

      return item.username.toLowerCase().includes(term.toLowerCase()) ||
        prosumerUUIDs.some((uuid: string) => uuid.includes(term.toLowerCase())) ||
        projectNames.some((name: string) => name.includes(term.toLowerCase())) ||
        countryCodes.some((code: string) => code.includes(term.toLowerCase()));
      // Add more conditions as needed
    });
  }
}
