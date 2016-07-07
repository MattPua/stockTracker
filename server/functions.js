import _ from 'underscore';
export function getAdditionalValues(stock){
  let newObj = _.extend({},stock);
  let targetPrice = stock.targetPrice;
  let sharesOwned = stock.sharesOwned;
  let price = stock.price;
  newObj['priceChange'] = targetPrice > 0 ? (parseFloat(price) - parseFloat(targetPrice)).toFixed(2) : 0;
  newObj['marketValue'] = (parseFloat(price) * parseInt(sharesOwned)).toFixed(2);
  newObj['bookValue'] = (parseFloat(targetPrice) * parseInt(sharesOwned)).toFixed(2);
  newObj['profit'] = sharesOwned > 0 ? (newObj['priceChange'] * sharesOwned).toFixed(2) : 0;
  return newObj;
}
export function createObjectFromProperties(object){
  let obj = {};
  for (let property in object){
    if (object.hasOwnProperty(property))
      obj[property] = object[property];
  }
  return obj;
}

export function isSignedIn(cookies,body,params){
  let userId = ( (cookies ? cookies.userId : null) || body.userId || params.userId || null);
  if (userId == null)console.error('User attempting to access function without being signed in');
  return userId;
}
