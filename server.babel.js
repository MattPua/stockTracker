import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config.js';
import bodyParser from 'body-parser';
import MongoClient from 'mongodb';
import DBConfig from './_config';
import request from 'request';
// Note: Need to use the babel file otherwise cannot use es6 style
const app = express();
const compiler = webpack(webpackConfig);

// Extracts data from <form> elements and adds to body property in req object
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/src'));
// TODO: Development Mode Only
app.use(webpackMiddleware(compiler,{
  stats: {
    colors: true,
    chunks: false,
    'errors-only': true
  },
  publicPath: webpackConfig.output.publicPath
}));
app.use(webpackHotMiddleware(compiler,{
  log: console.log
}));


let db;
MongoClient.connect('mongodb://'+DBConfig.MONGO_USERNAME+':'+DBConfig.MONGO_PASSWORD+DBConfig.MONGO_APP,(err,database) =>{
  if(err) return console.error(err);
  db = database;

  let server = app.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("App listening @ http://%s:%s",host,port);
  });
});


app.get('/', (req, res) => {
  // Note: __dirname is the path to your current working directory. 
  res.sendFile(__dirname + '/index.html')
  let cursor = db.collection('quotes').find().toArray(function(err,results){
    console.log(results);
  });
});

app.post('/quotes',(req,res) => {
  request('http://finance.yahoo.com/d/quotes.csv?s='+req.body.stock+'.TO&f=nab', (error,response,body) =>{
    console.log(response.statusCode);
    if (!error && response.statusCode == 200) {
            console.log(body) // Print the google web page.
         }
         else console.log(error);
  });
/*  db.collection('quotes').save(req.body, (err,results) => {
    if (err) return console.error(err);
    console.log("Saved to database");
    res.redirect('/');
  });*/
    res.redirect('/');

});



