import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockLogo'
})
export class StockLogoPipe implements PipeTransform {
  transform(text: string): string {
    return text.substr(0, 2).toUpperCase();
  }
}
