const axios = require('axios');
const api = require('./api');

// global variables
let tickQty = 0;
let sellQty = 0;
let buyQty = 0;

async function run() {
  const config = {
    symbol: 'BTCUSDT',
    asset: 'BTC',
    base: 'USDT',
    allocation: 0.00025,  // 1.1*10/50000
    spread: 0.0015,
    tickInterval: 60000,
  }

  //await api.cancelAllOpenOrders(config.symbol, null);
  await tick(config);
  await setInterval(tick, config.tickInterval, config);
};

const tick = async (config) => {
  const { symbol, asset, base, allocation, spread } = config;
  console.log('----------------------------------------------------------------------------------------------');
  tickQty++;
  console.log(`# ${tickQty} ${Date().toString()} Market: ${symbol}`);


  // Search open orders
  const orders = await api.currentOpenOrders(symbol, null);
  if (!orders.length) {
    console.log('There are not open orders');
  }
  else {
    //console.log('Orders: ', orders);
    console.log(`Cancel ${orders.length} open orders`);
    orders.forEach(async function (order) {
      console.log(`Order: ${order.orderId} Market: ${order.symbol} Side: ${order.side}`);
      await api.cancelOrder(symbol, order.orderId, null);
      if (tickQty !== 1) {
        if (order.side === 'SELL') sellQty--;
        else buyQty--;
      }
    });
  };

  const marketPrice = await api.averagePrice(symbol);

  console.log(`Market price: ${parseFloat(marketPrice.price).toFixed(2)}`);

  const sellPrice = (marketPrice.price * (1 + spread)).toFixed(2);
  const buyPrice = (marketPrice.price * (1 - spread)).toFixed(2);

  const account = await api.accountInformation(null);
  const assetBalance = account.balances.find(element => element.asset === asset).free;
  const baseBalance = account.balances.find(element => element.asset === base).free;
  console.log(`Balance asset/base: ${parseFloat(assetBalance).toFixed(7)} / ${parseFloat(baseBalance).toFixed(2)}, Sells: ${sellQty}, Buys: ${buyQty}`);

  const sellVolume = allocation;
  const buyVolume = allocation;

  const sellOrder = await api.newOrder(symbol, sellVolume, sellPrice, 'SELL', 'LIMIT', 'GTC');
  console.log(`Limit sell order ${sellVolume} @ ${sellPrice}, Id: ${sellOrder.orderId}, Notional value = ${(sellVolume * sellPrice).toFixed(2)}`);
  sellQty++;
  const buyOrder = await api.newOrder(symbol, buyVolume, buyPrice, 'BUY', 'LIMIT', 'GTC');
  console.log(`Limit buy order ${buyVolume} @ ${buyPrice}, Id: ${buyOrder.orderId}, Notional value = ${(buyVolume * buyPrice).toFixed(2)}`);
  buyQty++;

};

run();