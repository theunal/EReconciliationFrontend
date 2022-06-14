import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'accountReconciliationStatusPipe'
})
export class AccountReconciliationStatusPipe implements PipeTransform {

  transform(value: any[], activePassive: string): any {

    if (activePassive == "Onaylandı") {
      return value.filter(x => x.isResultSucceed == true)
    }
    else if (activePassive == "Onaylanmadı") {
      return value.filter(x => x.isResultSucceed == false)
    }
    else if (activePassive == "Bekleniyor") {
      return value.filter(x => x.isResultSucceed == null)
    }
    else {
      return value
    }
  }

}
