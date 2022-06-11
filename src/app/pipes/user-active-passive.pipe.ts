import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currentAccountActivePassivePipe'
})
export class UserActivePassivePipe implements PipeTransform {

  transform(value: any[], activePassive: string): any {

    if (activePassive == "Aktif") {
      return value.filter(x => x.userIsActive == true)
    }
    else if (activePassive == "Pasif") {
      return value.filter(x => x.userIsActive == false)
    }
    else {
      return value
    }
  }

}
