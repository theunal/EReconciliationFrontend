import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'accountReconciliationPipe'
})
export class AccountReconciliationPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(i => {
      const accountName = i.accountName.toLowerCase().toString().includes(searchString.toLowerCase())
      const accountCode = i.accountCode.toLowerCase().toString().includes(searchString.toLowerCase())
      const startingDate = i.startingDate.toLowerCase().toString().includes(searchString.toLowerCase())
      const endingDate = i.endingDate.toLowerCase().toString().includes(searchString.toLowerCase())
      const accountEmail = i.accountEmail.toLowerCase().toString().includes(searchString.toLowerCase())
      const currencyDebit = i.currencyDebit.toString().includes(searchString.toLowerCase())
      const currencyCredit = i.currencyCredit.toString().includes(searchString.toLowerCase())

      return (accountName + accountCode + startingDate + endingDate + accountEmail + currencyDebit + currencyCredit)
    })
  }

}
