import FirebaseWrapper from './FirebaseWrapper';
import C from './_constants';
import AppHelper from './other/apphelper';
class StorageWrapper {
  static getInitialData(storageType,state,callback){
    if (storageType == C.FileStorageType.CACHE){
      // Check if LocalStorage C.APPNAME exists, if not , create
      if (window.localStorage.getItem(C.APPNAME) != null){
        let data= StorageWrapper.getData(storageType);
        callback(data);
      }
      else
        window.localStorage.setItem(C.APPNAME,
          JSON.stringify(state)
        );
    }
    else if (storageType == C.FileStorageType.FIREBASE){
      // Check if it doesn't exist, if it doesn't create a new blob in firebase
      FirebaseWrapper.readNodeNow('/',function(data){
        callback(data);
      });
    }
    else console.error("invalid filestorage type!");
  }

  static getData(storageType){
    if (storageType==C.FileStorageType.CACHE){
      let localStorage = JSON.parse(window.localStorage.getItem(C.APPNAME));
      return localStorage;
    }
    else if (storageType == C.FileStorageType.FIREBASE){
      // TODO: Trigger Watches on specific children
    }
    else console.error("invalid filestorage type!");
  }

  static saveDataToCache(state){
    window.localStorage.setItem(C.APPNAME,JSON.stringify(state));
  }

  static saveDataToFirebase(child,path,data){
    // We assume every data is an object, and contains an ID key
    FirebaseWrapper.pushNewData(child,path,data);
  }

  static updateDataToFirebase(child,path,data){
    FirebaseWrapper.updateData(child,path,data);
  }

  static deleteDataFromFirebase(path){
    FirebaseWrapper.deleteData(path);
  }


}

export default StorageWrapper;