import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'accountReconciliationStatusPipe'
})
export class AccountReconciliationStatusPipe implements PipeTransform {

  transform(value: any[], activePassive: string): any {

    if (activePassive == "OnaylandÄ±") {
      return value.filter(x => x.isResultSucceed == true)
    }
    else if (activePassive == "OnaylanmadÄ±") {
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
