const api = require('./api');

async function run() {

  let result;

  // result = await api.newOrder('BTCUSDT', 0.00022, 55000, 'SELL', 'LIMIT', 'GTC');
  // console.log(result);

  // result = await api.newOrder('BTCUSDT', 0.002, 47000, 'BUY', 'LIMIT', 'GTC');
  // console.log(result);

  // result = await api.newOrder('BTCUSDT', 0.00022, null, 'SELL', 'MARKET', null);
  // console.log(result);

  // result = await api.newOrder('BTCUSDT', 0.00022, null, 'BUY', 'MARKET', null);
  // console.log(result);

  // result = await api.cancelOrder('BTCUSDT', 897822, null);
  // console.log(result);

  // result = await api.exchangeInfo('BTCUSDT');
  // console.log('exchange info ', result);

  // result = await api.checkServerTime();
  // console.log(result.serverTime);

  result = await api.orderBook('BTCUSDT', 5);
  console.log('depth ', result);

  // result = await api.accountInformation(null);
  // console.log(result);

  // result = await api.currentOpenOrders('BTCUSDT', null);
  // console.log(result);

  // result = await api.accountTradeList('BTCUSDT', null, null, null, null, null);
  // console.log(result);

  // result = await api.queryOrder('BTCUSDT', 897822, null, null);
  // console.log(result);

  result = await api.averagePrice('BTCUSDT');
  console.log('average price ', result);

  result = await api.candleStickData('BTCUSDT', '1m', null, null, 1);
  console.log('candlestick ', result);

  result = await api.tickerPrice('BTCUSDT');
  console.log('tick price ',result.lastPrice);  

}

run();
