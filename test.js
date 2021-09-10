let objeto = {
  makerCommission: 0,
  takerCommission: 0,
  buyerCommission: 0,
  sellerCommission: 0,
  canTrade: true,
  canWithdraw: false,
  canDeposit: false,
  updateTime: 1631059040796,
  accountType: 'SPOT',
  balances: [
    { asset: 'BNB', free: '1000.00000000', locked: '0.00000000' },
    { asset: 'BTC', free: '1.01066600', locked: '0.00000000' },
    { asset: 'BUSD', free: '10000.00000000', locked: '0.00000000' },
    { asset: 'ETH', free: '100.00000000', locked: '0.00000000' },
    { asset: 'LTC', free: '500.00000000', locked: '0.00000000' },
    { asset: 'TRX', free: '500000.00000000', locked: '0.00000000' },
    { asset: 'USDT', free: '9784.80862810', locked: '0.00000000' },
    { asset: 'XRP', free: '50000.00000000', locked: '0.00000000' }
  ],
  permissions: [ 'SPOT' ]
};
console.log('hola');
console.log(objeto.balances.find(element => element.asset === 'BTC').free);
console.log(objeto.balances.asset['BTC'].free);