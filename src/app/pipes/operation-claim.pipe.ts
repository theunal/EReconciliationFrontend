import { Pipe, PipeTransform } from '@angular/core';
import { OperationClaimModel } from '../models/operationClaimModel';

@Pipe({
  name: 'operationClaimPipe'
})
export class OperationClaimPipe implements PipeTransform {

  transform(value: OperationClaimModel[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(i => {
      const name = i.name.toLowerCase().toString().includes(searchString.toLowerCase())
      return (name)
    })

  
  }

}
