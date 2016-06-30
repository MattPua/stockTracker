import _ from 'underscore';
export function getAdditionalValues(stock){
  let newObj = _.extend({},stock);
  let targetPrice = stock.targetPrice;
  let sharesOwned = stock.sharesOwned;
  let price = stock.price;
  newObj['priceChange'] = targetPrice > 0 ? (parseFloat(price) - parseFloat(targetPrice)) : 0;
  newObj['marketValue'] = parseFloat(price) * parseInt(sharesOwned);
  newObj['bookValue'] = parseFloat(targetPrice) * parseInt(sharesOwned);
  newObj['profit'] = sharesOwned > 0 ? (newObj['priceChange'] * sharesOwned) : 0;
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