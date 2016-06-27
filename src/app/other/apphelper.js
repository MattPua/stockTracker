class AppHelper{
  static notInitialized(){
    console.error('[INIT ERROR] IS NOT INITIALIZED!');
  }

  static toUpperOne(word){
    return word[0].toUpperCase() + word.substring(1,word.length);
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

}

export default AppHelper;