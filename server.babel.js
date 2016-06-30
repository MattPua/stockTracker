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
import winston from 'winston';
import expressWinston from 'express-winston';
import * as Functions from './functions';
import _ from 'underscore';
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
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ],
  meta: false, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
  colorStatus: true, // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ]
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
    if (err) console.error(err);
  });
});

// AddStock()
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
  });
});

// GetStocks()
app.get('/quotes',(req,res)=>{
  let cursor = db.collection('quotes').find().toArray(function(err,results){
    if (err) {
      console.error(err);
      res.json({result: 'failure'});
    }
    else{
      let stocks = [];
      let query = '';
      for (let s of results){
        let newStock = {};
        newStock = Functions.createObjectFromProperties(s);
        stocks.push(newStock);
        query+=s.symbol+"+";
      }
      query = query.substring(0,query.length-1);

      request('http://finance.yahoo.com/d/quotes.csv?s='+query+'&f=snabcml1vydr1qw', (error,response,body) =>{
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
              // TODO: is there a better way to do this
              if (value == '') break;
              value = value.replace(/"/g,'');
              if (i      == 0) key = 'symbol';
              else if (i ==1) key ='name';
              else if (i ==2) key = 'ask';
              else if (i ==3) key ='bid';
              else if (i ==4) key ='change';
              else if (i ==5) key = 'dayRange';
              else if (i ==6) key = 'price';
              else if (i ==7) key ='volume';
              else if (i ==8) key ='dividendYield';
              else if (i ==9) key = 'dividendPerShare';
              else if (i ==10) key ='dividendPayDate';
              else if (i ==11)key = 'exDividendDate';
              else if (i ==12) key ='yearRange';
              stock[key] = value;
            }
            for (let s of stocks){
              if (s['symbol'] == stock.symbol){
                let updatedStock = _.extend({},stock,s);
                updatedStock = Functions.getAdditionalValues(updatedStock);
                if (Object.keys(stock).length)
                  stocksFormatted.push(updatedStock);
              }
            }
          }
          res.json({stocks: stocksFormatted});
        }
        else console.log(error);
      });
    }
  });
});

// EditStock()
app.post('/quotes/:id',(req,res)=>{
  let id =req.params.id
  util.log(util.inspect(req.body));
  let properties = req.body.properties;
  // TODO: Need to do the checking for this
  let targetPrice = parseFloat(properties.targetPrice).toFixed(2);
  let sharesOwned = parseInt(properties.sharesOwned);
  db.collection('quotes').update(
    { '_id' : new MongoClient.ObjectID(id) },
    {
      $set: { 'targetPrice' : targetPrice, 'sharesOwned': sharesOwned},
      $currentDate: { 'lastModified': true}
    },
    (err,results) => {
    if (err) {
      console.error(err);
      res.json({success: false});
    }
    console.log("Saved to database");
    res.json({success: true});
  });

});


// RemoveStock()
app.post('/quotes/:id/delete',(req,res)=>{
  util.log(util.inspect(req.body));
  let id =req.params.id
  console.log(id);
  // Should be by ID
  db.collection('quotes').deleteOne({_id: new MongoClient.ObjectID(id)},(err,result) =>{
    if (err) console.error(err);
    res.json({id: id});
  });

});


/*// GetUpdatedStockInfo()
app.post('/quotes',(req,res) => {
  util.log(util.inspect(req.body));

  request('http://finance.yahoo.com/d/quotes.csv?s='+req.body.stock+'&f=snabcml1vydr1qw', (error,response,body) =>{
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
          if (i      == 0) key = 'symbol';
          else if (i ==1) key ='name';
          else if (i ==2) key = 'ask';
          else if (i ==3) key ='bid';
          else if (i ==4) key ='change';
          else if (i ==5) key = 'dayRange';
          else if (i ==6) key = 'price';
          else if (i ==7) key ='volume';
          else if (i ==8) key ='dividendYield';
          else if (i ==9) key = 'dividendPerShare';
          else if (i ==10) key ='dividendPayDate';
          else if (i ==11)key = 'exDividendDate';
          else if (i ==12) key ='yearRange';
          stock[key] = value;
        }
        stock = Functions.getAdditionalValues(stock);

        if (Object.keys(stock).length)
          stocksFormatted.push(stock);
      }
      res.json({data: stocksFormatted});
    }
    else console.log(error);
  });
});

*/


