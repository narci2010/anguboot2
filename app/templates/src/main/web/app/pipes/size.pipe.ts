import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'size'})
export class SizePipe implements PipeTransform {

  transform(value: number): string {

        if (value < 1048576) {
            return (value / 1024).toFixed(2) + ' kB';
        } else if (value < 1073741824) {
            return (value / 1048576).toFixed(2) + ' MB';
        } else if (value < 1099511627776) {
            return (value / 1073741824).toFixed(2) + ' GB';
        } else if (value < 1125899906842624) {
            return (value / 1099511627776).toFixed(2) + ' TB';
        } else {
            return value + ' bytes';
        }
  }
}
