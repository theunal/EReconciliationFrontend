import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currentAccountActivePassive'
})
export class CurrentAccountActivePassivePipe implements PipeTransform {

  transform(value: any[], activePassive: string): any {

    if (activePassive == "Aktif") {
      return value.filter(x => x.isActive == true)
    }
    else if (activePassive == "Pasif") {
      return value.filter(x => x.isActive == false)
    }
    else {
      return value
    }
  }

}
