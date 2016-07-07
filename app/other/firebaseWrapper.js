import firebase from 'firebase';
class FirebaseWrapper{
  // TODO: Promises

  // Overwrites data at location
  static writeData(path,data){
    try{
      firebase.database().ref(path).set(data);
    }
    catch(err){
      console.error("FAILED WRITING DATA TO FIREBASE to: "+ path);
      console.error(data)
    }
  }

  // Pushes to list without overwriting
  static pushNewData(child,path,data){
    try{
      let key = firebase.database().ref().child(child).push().key;
      return firebase.database().ref(path).update(data);
    }
    catch(err){
      console.error("FAILED pushing new DATA TO FIREBASE to: "+ path);
      console.error(data)
    }
  }

  static updateData(child,path,data){
    try{
      return firebase.database().ref(path).update(data);
    }
    catch(err){
      console.error("FAILED updating DATA TO FIREBASE to: "+ path);
      console.error(data)
    }
  }
  // TODO: Transactions
  
  static deleteData(path){
    try{
      firebase.database().ref(path).set(null);
    }
    catch(err){
      console.error("FAILED deleting DATA from FIREBASE to: "+ path);
    }
  }

  static readNodeNow(path,callback){
    firebase.database().ref(path).once('value').then(function(snapshot){
      callback(snapshot.val());
    });
  }

  static watchNode(path,callback){
    firebase.database().ref(path).on('value',function(snapshot){
      callback(snapshot.val());
    });
  }

  static childEvents(path,callback){
    let x = firebase.database().ref(path);
    x.on('child_added',function(data){
      callback(data);
    });
    x.on('child_changed',function(data){
      callback(data);
    });
    x.on('child_removed',function(data){
      callback(data);
    });
  }
}


export default FirebaseWrapper;