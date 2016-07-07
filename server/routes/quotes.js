import util from 'util';
import * as Functions from '../functions';
import _ from 'underscore';
import MongoClient from 'mongodb';
import request from 'request';
module.exports=function(app,db){
  // AddStock()
  app.post('/quotes/new',(req,res)=>{
    let userId = null;
    if ( ( userId = Functions.isSignedIn(req.cookies,req.body,req.params) ) == null) {res.json({success: false, error: 'Not Signed In'}); return;}
    console.log('saving stock');
    util.log(util.inspect(req.body));
    let stock = req.body;
    stock.userId = new MongoClient.ObjectID(userId);
    db.collection('quotes').save(stock, (err,results) => {
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
    let userId = null;
    if ( ( userId = Functions.isSignedIn(req.cookies,req.body,req.params) ) == null) {res.json({success: false, error: 'Not Signed In'}); return;}

    let cursor = db.collection('quotes').find({
      userId: new MongoClient.ObjectID(userId),
    }).toArray(function(err,results){
      if (err) {
        console.error(err);
        res.json({result: 'failure'});
      }
      else{
        let stocks = [];
        let query = '';
        let symbolsUsedInQuery = [];
        for (let s of results){
          let newStock = {};
          newStock = Functions.createObjectFromProperties(s);
          stocks.push(newStock);
          if (symbolsUsedInQuery.indexOf(s.symbol)>=0) continue;
          symbolsUsedInQuery.push(s.symbol);
          query+=s.symbol+"+";
        }
        query = query.substring(0,query.length-1);

        request('http://finance.yahoo.com/d/quotes.csv?s='+query+'&f=snabcml1vydr1qwop', (error,response,body) =>{
          if (!error && response.statusCode == 200) {
            let stocksNoFormat = body.split('\n');
            console.log(stocksNoFormat);
            let stocksFormatted = [];
            for(let stockNoFormat of stocksNoFormat){
              let stock = {};
              // https://stackoverflow.com/questions/23582276/split-string-by-comma-but-ignore-commas-inside-quotes
              let stockArray = stockNoFormat.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
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
                else if (i ==4) {key ='change'; value=value.split(' ')[0]}
                else if (i ==5) key = 'dayRange';
                else if (i ==6) key = 'price';
                else if (i ==7) key ='volume';
                else if (i ==8) key ='dividendYield';
                else if (i ==9) key = 'dividendPerShare';
                else if (i ==10) key ='dividendPayDate';
                else if (i ==11)key = 'exDividendDate';
                else if (i ==12) key ='yearRange';
                else if (i ==13) key ='open';
                else if (i == 14)key='previousClose';
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
    let userId = null;
    if ( ( userId = Functions.isSignedIn(req.cookies,req.body,req.params) ) == null) {res.json({success: false, error: 'Not Signed In'}); return;}

    let id =req.params.id
    util.log(util.inspect(req.body));
    let properties = req.body.properties;
    // TODO: Need to do the checking for this
    let targetPrice = parseFloat(properties.targetPrice).toFixed(2);
    let sharesOwned = parseInt(properties.sharesOwned);
    db.collection('quotes').update(
      { '_id' : new MongoClient.ObjectID(id), 'userId' : new MongoClient.ObjectID(userId) },
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
    let userId = null;
    if ( ( userId = Functions.isSignedIn(req.cookies,req.body,req.params) ) == null) {res.json({success: false, error: 'Not Signed In'}); return;}
    util.log(util.inspect(req.body));
    let id =req.params.id
    // Should be by ID
    db.collection('quotes').deleteOne({_id: new MongoClient.ObjectID(id), userId: new MongoClient.ObjectID(userId)},(err,result) =>{
      if (err) console.error(err);
      res.json({id: id});
    });

  });

  // SearchStock()
  app.get('/quotes/search?',(req,res)=>{
    let userId = null;
    if ( ( userId = Functions.isSignedIn(req.cookies,req.body,req.params) ) == null) {res.json({success: false, error: 'Not Signed In'}); return;}

    let symbol = req.query.symbol;
    util.log(util.inspect(req.body));
    request('http://finance.yahoo.com/d/quotes.csv?s='+symbol+'&f=snab',(error,response,body) =>{
      if (!error && response.statusCode == 200){
        let stocksNoFormat = body.split('\n')[0];
        let values = stocksNoFormat.split(',');
        let stock = {
          name: values[1].replace(/"/g,''),
          symbol: symbol
        };
        res.json({success: true, data: stock});
      }
      else {
        console.error(err);
        res.json({success: false});
      }
    });
  });

}