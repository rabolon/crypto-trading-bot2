require('dotenv').config();
const axios = require('axios');
const querystring = require('querystring');
const crypto = require('crypto');

const apiKey = process.env.API_KEY;
const apiSecret = process.env.SECRET_KEY;
const apiUrl = process.env.API_URL;

async function privateCall(path, data = {}, method = 'GET') {
  const timestamp = Date.now();
  const signature = crypto.createHmac('sha256', apiSecret)
    .update(`${querystring.stringify({ ...data, timestamp })}`)
    .digest('hex');
  const newData = { ...data, timestamp, signature };
  const qs = `?${querystring.stringify(newData)}`;
  //console.log(qs);
  try {
    const result = await axios({
      method,
      url: `${apiUrl}${path}${qs}`,
      headers: { 'X-MBX-APIKEY': apiKey }
    });
    return result.data;
  }
  catch (err) {
    console.log(err);
  }
}

async function publicCall(path, data, method = 'GET') {
  try {
    const qs = data ? `?${querystring.stringify(data)}` : '';
    // console.log(qs);
    const result = await axios({
      method,
      url: `${apiUrl}${path}${qs}`
    });
    return result.data;
  }
  catch (err) {
    console.log(err);
  }
}

function deleteArguments(data) {    // elimina entradas con valor null de un objeto data
  Object.entries(data).forEach(([key, value]) => {
    if (value == null) delete data[key];
  });
  return data;
}

//------------------------------------------------------------------------

function testNewOrder(symbol, quantity, price, side, type, timeInForce) {
  let data = {
    symbol: symbol,
    quantity: quantity,
    price: price,
    side: side,
    type: type,
    timeInForce: timeInForce
  };
  deleteArguments(data);
  return privateCall('/v3/order/test', data, 'POST');
}

//------------------------------------------------------------------------

function newOrder(symbol, quantity, price, side, type, timeInForce) {
  let data = {
    symbol: symbol,   
    quantity: quantity,
    price: price,
    side: side,
    type: type,
    timeInForce: timeInForce
  };
  deleteArguments(data);
  return privateCall('/v3/order', data, 'POST');
}

//------------------------------------------------------------------------

function cancelOrder(symbol, orderId, recvWindow) {
  let data = {
    symbol: symbol,   // mandatory
    orderId: orderId,
    recvWindow: recvWindow
  }
  deleteArguments(data);
  return privateCall('/v3/order', data, 'DELETE');
}

//------------------------------------------------------------------------

function cancelAllOpenOrders(symbol, recvWindow) {
  data = {
    symbol: symbol,   // mandatory
    recvWindow: recvWindow,
  };
  deleteArguments(data);
  return privateCall('/v3/openOrders', data, 'DELETE');
}

//------------------------------------------------------------------------

function queryOrder(symbol, orderId, origClientOrderId, recvWindow) {
  let data = {
    symbol: symbol,       // mandatory
    orderId: orderId,
    origClientOrderId: origClientOrderId,
    recvWindow: recvWindow,
  };
  deleteArguments(data);
  return privateCall('/v3/order', data, 'GET');
}

//------------------------------------------------------------------------

function currentOpenOrders(symbol, recvWindow) {
  let data = {
    symbol: symbol,
    recvWindow: recvWindow,
  };
  deleteArguments(data);
  return privateCall('/v3/openOrders', data, 'GET');
}

//------------------------------------------------------------------------

function allOrders(symbol, orderId, startTime, endTime, limit, recvWindow) {  // Get all account orders; active, canceled, or filled
  let data = {
    symbol: symbol,       // mandatory
    orderId: orderId,
    startTime: startTime,
    endTime: endTime,
    limit: limit,         // default 500, max 10000
    recvWindow: recvWindow
  };
  deleteArguments(data);
  return privateCall('/v3/allOrders', data, 'GET');
}

//------------------------------------------------------------------------

function accountInformation(recvWindow) {
  let data = {
    recvWindow: recvWindow
  };
  deleteArguments(data);
  return privateCall('/v3/account', data, 'GET');
}

//------------------------------------------------------------------------

function accountTradeList(symbol, orderId, startTime, endTime, fromId, limit, recvWindow) {  // Get all account orders; active, canceled, or filled
  let data = {
    symbol: symbol,       // mandatory
    orderId: orderId,
    startTime: startTime,
    endTime: endTime,
    fromId: fromId,       // TradeId to fetch from. Default gets most recent trades
    limit: limit,         // default 500, max 10000
    recvWindow: recvWindow
  };
  deleteArguments(data);
  return privateCall('/v3/myTrades', data, 'GET');
}

//------------------------------------------------------------------------

function testConnectivity() {
  return publicCall('/v3/ping', 'GET');
}

//------------------------------------------------------------------------

function checkServerTime() {
  return publicCall('/v3/time', 'GET');
}

//------------------------------------------------------------------------

function exchangeInfo(symbol) {
  let data = { symbol: symbol };
  deleteArguments(data);
  return publicCall('/v3/exchangeInfo', data);
}

//------------------------------------------------------------------------

function orderBook(symbol, limit) { 
  let data = { 
    symbol: symbol,   // mandatory
    limit: limit
  };
  deleteArguments(data);
  return publicCall('/v3/depth', data, 'GET');
}

//------------------------------------------------------------------------

function candleStickData(symbol, interval, startTime, endTime, limit) {
  let data = {
    symbol: symbol,       // mandatory
    interval: interval,   // mandatory
    startTime: startTime, // If startTime and endTime are not sent, the most recent klines are returned 
    endTime: endTime,
    limit: limit          
  }
  deleteArguments(data);
  return publicCall('/v3/klines', data);
}

//------------------------------------------------------------------------

function averagePrice(symbol) {
  let data = { 
    symbol: symbol    // mandatory
  };  
  return publicCall('/v3/avgPrice', data);
}

//-----------------------------------------------------------------------

function tickerPrice(symbol) {  // 24 hour rolling window price change statistics
  let data = { 
    symbol: symbol 
  };
  deleteArguments(data);
  return publicCall('/v3/ticker/24hr', data);
}

//-----------------------------------------------------------------------

function symbolPriceTicker(symbol) {  // Latest price for a symbol or symbols
  let data = { 
    symbol: symbol 
  };
  deleteArguments(data);
  return publicCall('/v3/ticker/price', data);
}

module.exports = { testNewOrder, newOrder, cancelOrder, cancelAllOpenOrders, queryOrder, currentOpenOrders, allOrders, accountInformation, accountTradeList, testConnectivity, checkServerTime, exchangeInfo, orderBook, candleStickData, averagePrice, tickerPrice, symbolPriceTicker };