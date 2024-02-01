import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multiSort'
})
export class MultiSortPipe implements PipeTransform {
  transform(array: any[], keys: string[]): any[] {
    if (!Array.isArray(array) || array.length <= 1) {
      return array;
    }

    array.sort((a, b) => {
      // Check if either array contains null values in positions 2 and 3
      const nullInA = a[2] === null && a[3] === null;
      const nullInB = b[2] === null && b[3] === null;

      // If only one array has null values in positions 2 and 3, prioritize it
      if (nullInA && !nullInB) {
        return -1;
      } else if (!nullInA && nullInB) {
        return 1;
      }

      // If both arrays have null values in positions 2 and 3 or neither does,
      // compare their values according to the specified keys
      for (let key of keys) {
        const valueA = this.getValue(a, key);
        const valueB = this.getValue(b, key);

        if (valueA === null && valueB !== null) {
          return -1; // Move null values to the beginning
        } else if (valueA !== null && valueB === null) {
          return 1; // Move null values to the beginning
        } else if (valueA < valueB) {
          return -1;
        } else if (valueA > valueB) {
          return 1;
        }
      }

      return 0;
    });

    return array;
  }

  private getValue(object: any, key: string): any {
    if (!object || typeof object !== 'object' || !key) {
      return null;
    }

    const keys = key.split('.');
    let value = object;

    for (let k of keys) {
      if (value.hasOwnProperty(k)) {
        value = value[k];
      } else {
        return null;
      }
    }

    return value;
  }
}
