class AppHelper{
  static notInitialized(){
    console.error('[INIT ERROR] IS NOT INITIALIZED!');
  }

  static toUpperOne(word){
    return word[0].toUpperCase() + word.substring(1,word.length);
  }

  static toLowerOne(word){
    return word[0].toLowerCase() + word.substring(1,word.length);
  }

  static toUpperFirstLetterOnly(sentence){
    let words = [];
    for (let word of sentence.split(' ')){
      word = word.toLowerCase() + " ";
      words.push(AppHelper.toUpperOne(word));
    }
    return words;
  }

  static getRoundedUnit(amount){
    let val = parseInt(amount);
    if (amount / 1000000 > 1) val = parseFloat(val/1000000).toFixed(1) + 'M';
    else if (amount / 1000 > 1) val = parseFloat(val/100000).toFixed(1)+'k';
    else val = parseFloat(val).toFixed(1);
    return val;
  }

  static convertArrayFromFirebase(item,key){
    let array = [];
    for (let j in item[key]){
      array.push(item[key][j]);
    }
    return array;
  }

  static ajaxConfig(url,type,data){
    let base = 'http://localhost:3000/api/';//'http://159.203.42.58:3000/api/';
    return {
      url: base + url,
      type: type,
      dataType: "json",
      data:data,
      contentType: 'application/json'
    };
  }

  static ajaxFailure(err,callback){
    console.error(err);
    if (callback != null && typeof(callback) =='function') callback();
  }

  static ajaxCall(object,config,callback,errCallback){
    $.ajax({
      url: config.url,
      type: config.type,
      dataType: config.dataType,
      data: config.data,
      contentType: config.contentType,
      success: (data) => { callback(data,object);},
      error: (err) => {AppHelper.ajaxFailure(err,errCallback);}
    });
  }

  static createObjectFromProperties(object){
    let obj = {};
    for (let property in object){
      if (object.hasOwnProperty(property))
        obj[property] = object[property];
    }
    return obj;
  }

  static getMomentFormat(type='short'){
    if (type =='short')
      return 'MMMM Do, h:mm:ss a';
    else 
      return 'dddd, MMMM Do YYYY, h:mm:ss a';
  }

  static dynamicSort(property,direction=1){
    // NOTE: This has to be updated anytime you want to add a new category which could have negative values
    let listOfNumProps = ['price','ask','bid','volume','priceChange','change','profit'];

    return function(a,b){
      let aValue = a[property];
      let bValue = b[property];
      let result = null;
      if (listOfNumProps.indexOf(property) >=0 ) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      result = (aValue < bValue) ? -1 : (aValue > bValue) ? 1 : 0;
      return result * direction;
    };
  }

  static getParsedValue(value,type='$',value2=null,includePositive=true){
    if (type == '$' && includePositive)
      return (value > 0 ? '+$' : (value == 0 ? '$' :  '-$') ) + AppHelper.numberWithCommas(Math.abs(value).toFixed(2));
    else if (type == '$' && !includePositive)
      return (value >= 0 ? '$' : '-$' ) + AppHelper.numberWithCommas(Math.abs(value).toFixed(2));
    else if (type =='%' && value2 !=null)
      return (value >= 0 ? '':'-') + (Math.abs(value)/parseFloat(value2)).toFixed(2) +'%';
    else if (type == '%' && value2 ==null)
      return (value >= 0 ? '' : '-') + Math.abs(parseFloat(value)).toFixed(2) + '%';
  }

  static numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

}

export default AppHelper;