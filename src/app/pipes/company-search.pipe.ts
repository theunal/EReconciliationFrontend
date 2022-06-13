import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'companySearchPipe'
})
export class CompanySearchPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(i => {
      const name = i.name.toLowerCase().toString().includes(searchString.toLowerCase())
      const address = i.address.toLowerCase().toString().includes(searchString.toLowerCase())
      const taxDepartment = i.taxDepartment.toLowerCase().toString().includes(searchString.toLowerCase())
      const taxIdNumber = i.taxIdNumber.toLowerCase().toString().includes(searchString.toLowerCase())
      const addedAt = i.addedAt.toLowerCase().toString().includes(searchString.toLowerCase())

      return (name + address + taxDepartment + taxIdNumber + addedAt)
    })
  }

}