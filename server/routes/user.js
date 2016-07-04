import util from 'util';
import * as Functions from '../functions';
import _ from 'underscore';
import MongoClient from 'mongodb';
import request from 'request';
import bcrypt from 'bcrypt-nodejs';
module.exports=function(app,db){

  //Login
  app.post('/users',(req,res) =>{
    util.log(util.inspect(req.body));

    let user = req.body.username;

    // Password needs to be hashed and salted
    let password = req.body.password;

    db.collection('users').findOne({
      username: user,
    },function(err,results){
      console.log(results);
      if (err)res.json({success: false,error: err.errMsg});
      if (results == null || results.length == 0) res.json({success: false, error:'No account with that username'});
      // Now check the password hashes against each other
      else{
        bcrypt.compare(password,results.password,function(error,result){
          if (error) console.error(error);
          if (!result)res.json({success: false,error: 'Username/password combination was incorrect'});
          else res.cookie('userId',results._id,{ maxAge: 900000, httpOnly: true}).send({success: true, username: user}); 
        });
      }
    });
  });

  //Signup
  app.post('/users/new',(req,res)=>{
    util.log(util.inspect(req.body));

    let user = req.body.username;

    // Password needs to be hashed and salted
    let password = req.body.password;
    bcrypt.hash(password,null,null,function(errHashing,hash){
      if (errHashing) console.error(errHashing);
      let newId = new MongoClient.ObjectID();
      db.collection('users').save({
        username: user,
        password: hash,
        _id: newId,
      },function(err,results){
        console.log(results);
        if (err) {
          let error = err.errMsg;
          if (err.code == 11000) error = 'Username has already been taken';
          res.json({success: false, error: error});
        }
        else {
          res.cookie('userId',newId,{ maxAge: 900000, httpOnly: true}).send({success: true, username: user})
        }
      });
    })
  });
}