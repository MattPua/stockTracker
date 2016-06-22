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
import util from 'util';
// Note: Need to use the babel file otherwise cannot use es6 style
const app = express();
const compiler = webpack(webpackConfig);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer()); // for parsing multipart/form-data
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
  util.log(util.inspect(req.body));

  request('http://finance.yahoo.com/d/quotes.csv?s='+req.body.stock+'.TO&f=nab', (error,response,body) =>{
    console.log(response.statusCode);
    if (!error && response.statusCode == 200) {
      res.json({data: body});
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



