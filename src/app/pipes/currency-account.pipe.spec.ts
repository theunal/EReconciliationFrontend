import { CurrencyAccountPipe } from './currency-account.pipe';

describe('CurrencyAccountPipe', () => {
  it('create an instance', () => {
    const pipe = new CurrencyAccountPipe();
    expect(pipe).toBeTruthy();
  });
});
