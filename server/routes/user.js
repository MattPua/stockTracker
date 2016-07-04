import util from 'util';
import * as Functions from '../functions';
import _ from 'underscore';
import MongoClient from 'mongodb';
import request from 'request';

module.exports=function(app,db){

  //Login
  app.post('/users',(req,res) =>{
    util.log(util.inspect(req.body));

    let user = req.body.username;

    // Password needs to be hashed and salted
    let password = req.body.password;
    db.collection('users').findOne({
      username: user,
      password: password,
    },function(err,results){
      console.log(results);
      if (err)res.json({success: false,error: err.errMsg});
      else if (results == null || results.length == 0) res.json({success: false,error: 'Username/password combination was incorrect'});
      else res.cookie('userId',results._id,{ maxAge: 900000, httpOnly: true}).send({success: true, username: user}); 
    });
  });

  //Signup
  app.post('/users/new',(req,res)=>{
    util.log(util.inspect(req.body));

    let user = req.body.username;

    // Password needs to be hashed and salted
    let password = req.body.password;
    db.collection('users').save({
      username: user,
      password: password,
    },function(err,results){
      console.log(results);
      if (err) {
        let error = err.errMsg;
        if (err.code == 11000) error = 'Username has already been taken';
        res.json({success: false, error: error});
      }
      else {
        res.json({success: true, username: user, _id: results._id});
      }
    });

  });
}