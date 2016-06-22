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

}

export default AppHelper;