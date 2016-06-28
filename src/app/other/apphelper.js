class AppHelper{
  static notInitialized(){
    console.error('[INIT ERROR] IS NOT INITIALIZED!');
  }

  static toUpperOne(word){
    return word[0].toUpperCase() + word.substring(1,word.length);
  }

  static toUpperFirstLetterOnly(sentence){
    let words = [];
    for (let word of sentence.split(' ')){
      word = word.toLowerCase() + " ";
      words.push(AppHelper.toUpperOne(word));
    }
    return words;
  }

  static convertArrayFromFirebase(item,key){
    let array = [];
    for (let j in item[key])
      array.push(item[key][j]);
    return array;
  }

  static ajaxConfig(url,type,data){
    return {
      url: url,
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

  static dynamicSort(property,direction='ASC'){
    let sortOrder = 1;
    if (direction =='DESC') sortOrder = -1;
    return function(a,b){
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  static dynamicNestedSort(property,direction=1){
    let listOfNumProps = ['price','ask','bid'];

    return function(a,b){
      let aValue = a[a.symbol][property];
      let bValue = b[b.symbol][property];
      if (listOfNumProps.indexOf(property) >=0 ) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      var result = (aValue < bValue) ? -1 : (aValue > bValue) ? 1 : 0;
      return result * direction;
    }
  }
}

export default AppHelper;