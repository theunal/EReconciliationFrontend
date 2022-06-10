import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currentAccountActivePasive'
})
export class CurrentAccountActivePasivePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
