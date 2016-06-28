import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import expressLogger from 'express-logger';
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
app.use(expressLogger({path: '/logs/log.txt'}));


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

app.post('/quotes/new',(req,res)=>{
  console.log('saving stock');
  util.log(util.inspect(req.body));
  db.collection('quotes').save(req.body, (err,results) => {
    if (err) {
      console.error(err);
      res.json({success: false});
    }
    console.log("Saved to database");
    res.json({success: true});
    // res.redirect('/');
  });
});

// GetStocks()
app.get('/quotes',(req,res)=>{
  let cursor = db.collection('quotes').find().toArray(function(err,results){
    console.log('RESULTS: ');
    console.log(results);
    res.json({stocks: results});
  });
});


// RemoveStock()
app.post('/quotes/delete',(req,res)=>{
  util.log(util.inspect(req.body));
  console.log('deleting quote');
  let symbol = req.body.symbol;
  console.log(symbol);
  // Should be by ID
  db.collection('quotes').deleteOne({symbol: symbol});
  res.json({symbol: symbol});

});


// GetUpdatedStockInfo()
app.post('/quotes',(req,res) => {
  util.log(util.inspect(req.body));

  request('http://finance.yahoo.com/d/quotes.csv?s='+req.body.stock+'&f=snabcml1', (error,response,body) =>{
    if (!error && response.statusCode == 200) {
      let stocksNoFormat = body.split('\n');
      console.log(stocksNoFormat);
      let stocksFormatted = [];
      for(let stockNoFormat of stocksNoFormat){
        let stock = {};
        let stockArray = stockNoFormat.split(',');
        for (let i in stockArray){
          let key  = '';
          let value = stockArray[i];
          // TODO: Check this
          if (value == '') break;
          value = value.replace(/"/g,'');
          if (i == 0) key = 'symbol';
          else if (i==1) key='name';
          else if (i==2) {
            key = 'ask';
            value = parseFloat(value).toFixed(2);
          }
          else if (i==3) {
            key ='bid';
            value = parseFloat(value).toFixed(2);
          }
          else if (i==4) key ='change';
          else if (i==5) key = 'dayRange';
          else if (i==6) {
            key = 'price';
            value = parseFloat(value).toFixed(2);
          }
          stock[key] = value;
        }
        if (Object.keys(stock).length)
          stocksFormatted.push(stock);
      }
      res.json({data: stocksFormatted});
    }
    else console.log(error);
  });
/*  db.collection('quotes').save(req.body, (err,results) => {
    if (err) return console.error(err);
    console.log("Saved to database");
    res.redirect('/');
  });*/
    // res.redirect('/');

});



