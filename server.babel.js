import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config.js';
import bodyParser from 'body-parser';
import MongoClient from 'mongodb';
// Note: Need to use the babel file otherwise cannot use es6 style
const app = express();
const compiler = webpack(config);

let db;

MongoClient.connect('mongodb://admin:497022@ds011321.mlab.com:11321/stocktracker',(err,database) =>{
  if(err) return console.error(err);
  db = database;

  let server = app.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("App listening @ http://%s:%s",host,port);
  });
});

// Extracts data from <form> elements and adds to body property in req object
app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.static(__dirname + '/dist'));
app.use(webpackMiddleware(compiler));
app.use(webpackHotMiddleware(compiler));
app.get('/', (req, res) => {
  // Note: __dirname is the path to your current working directory. 
  res.sendFile(__dirname + '/src/index.html')
  let cursor = db.collection('quotes').find().toArray(function(err,results){
    console.log(results);
  });
});

app.post('/quotes',(req,res) => {
  console.log(req.body);
  db.collection('quotes').save(req.body, (err,results) => {
    if (err) return console.error(err);
    console.log("Saved to database");
    res.redirect('/');
  });
});



