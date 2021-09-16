// change management cancelled orders in order to co-live several bots.

const axios = require('axios');
const api = require('./api');

// global variables
let tickQty = 0;
let sellQty = 0;
let buyQty = 0;
let assetInit = 0;
let baseInit = 0;
let profit = 0;
let orderIdSell = '';
let orderIdBuy = '';

async function run() {
  const config = {
    symbol: 'BTCUSDT',
    asset: 'BTC',
    base: 'USDT',
    allocation: 0.00025,  // 1.1*10/50000
    spread: 0.0015,
    tickInterval: 60000,
    fee: 0.00075
  }

  //await api.cancelAllOpenOrders(config.symbol, null);
  await tick(config);
  await setInterval(tick, config.tickInterval, config);
};

const tick = async (config) => {
  const { symbol, asset, base, allocation, spread, fee } = config;
  console.log('----------------------------------------------------------------------------------------------');
  tickQty++;
  console.log(`# ${tickQty} ${Date().toString()}`);

  if (orderIdSell !== '') {
    const sellOrderStatus = await api.queryOrder(symbol, orderIdSell, null, null);
    if (sellOrderStatus.status == 'FILLED') {
      sellQty++;
      console.log(`Sell order ${orderIdSell} filled`);
    } else {
      await api.cancelOrder(symbol, orderIdSell, null);
      console.log(`Sell order ${orderIdSell} cancelled`); 
    } 
  }

  if (orderIdBuy !== '') {
    const buyOrderStatus = await api.queryOrder(symbol, orderIdBuy, null, null);
    if (buyOrderStatus.status == 'FILLED') {
      buyQty++;
      console.log(`Buy order ${orderIdBuy} filled`);
    } else {
      await api.cancelOrder(symbol, orderIdBuy, null);
      console.log(`Buy order ${orderIdBuy} cancelled`); 
    } 
  }

  const marketPrice = await api.averagePrice(symbol);

  console.log(`Market price: ${parseFloat(marketPrice.price).toFixed(2)}`);

  const sellPrice = (marketPrice.price * (1 + spread)).toFixed(2);
  const buyPrice = (marketPrice.price * (1 - spread)).toFixed(2);

  const account = await api.accountInformation(null);
  const assetBalance = account.balances.find(element => element.asset === asset).free;
  const baseBalance = account.balances.find(element => element.asset === base).free;

  if (tickQty == 1) {
    assetInit = assetBalance;
    baseInit =  baseBalance;
  }

  profit = (assetBalance-assetInit) * marketPrice.price
           + (baseBalance - baseInit) - (sellQty + buyQty) * (allocation * marketPrice.price) * fee;

  console.log(`Balance asset/base: ${parseFloat(assetBalance).toFixed(7)} / ${parseFloat(baseBalance).toFixed(2)}, Profit: ${profit.toFixed(4)}, Sells: ${sellQty}, Buys: ${buyQty}`);

  const sellVolume = allocation;
  const buyVolume = allocation;

  const sellOrder = await api.newOrder(symbol, sellVolume, sellPrice, 'SELL', 'LIMIT', 'GTC');
  console.log(`Limit sell order ${sellVolume} @ ${sellPrice}, Id: ${sellOrder.orderId}, Notional value = ${(sellVolume * sellPrice).toFixed(2)}`);
  orderIdSell = sellOrder.orderId;

  const buyOrder = await api.newOrder(symbol, buyVolume, buyPrice, 'BUY', 'LIMIT', 'GTC');
  console.log(`Limit buy order ${buyVolume} @ ${buyPrice}, Id: ${buyOrder.orderId}, Notional value = ${(buyVolume * buyPrice).toFixed(2)}`);
  orderIdBuy = buyOrder.orderId;

};

run();