import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(array: any[], searchTerm: string): any[] {
    if (!Array.isArray(array) || !searchTerm) {
      return array;
    }

    // Convert the searchTerm to lowercase for case-insensitive search
    const term = searchTerm.toLowerCase().trim();

    // Filter the array based on the searchTerm
    return array.filter(item => {
      // Convert each item to a string and check if it contains the searchTerm
      return Object.values(item).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        return false;
      });
    });
  }
}
