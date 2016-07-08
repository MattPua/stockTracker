import MongoClient from 'mongodb';
import config from './_config';
// Note: Need to use the babel file otherwise cannot use es6 style
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config.js';
import bodyParser from 'body-parser';
import winston from 'winston';
import expressWinston from 'express-winston';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import https from 'https';
import fs from 'fs';

const app = express();
const compiler = webpack(webpackConfig);
const privateKey = null;//fs.readFileSync('sslcert/server.key','utf8');
const certificate = null;//fs.readFileSync('sslcert/server.crt','utf8');
const credentials = {key: privateKey, cert: certificate};

app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

if (!process.env.NODE_ENV){
  app.use(express.static(__dirname + '/src'));
  app.use(webpackMiddleware(compiler,{
    stats: {
      colors: true,
      chunks: false,
      'errors-only': true
    },
    port: process.env.PORT || 8080,
    contentBase: './src',
    // Set this if you want to enable gzip compression for assets
    compress: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler,{
    log: console.log
  }));
}

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: false,
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
app.options('*', cors()); // include before other routes
app.use(cors());
MongoClient.connect('mongodb://'+config.MONGO_USERNAME+':'+config.MONGO_PASSWORD+config.MONGO_APP,(err,database) =>{
  if(err) return console.error(err);
  let routes = require('./server/routes/_main')(app,database);
});

let httpServer = http.createServer(app).listen(config.PORT,config.IP,function(){
    console.log('HTTP Server running at '+config.IP+":"+config.PORT);
  });
let httpsServer = https.createServer(credentials,app).listen(config.SSL_PORT,config.IP,function(){
    console.log('HTTPS Server running at '+config.IP+":"+config.SSL_PORT);
  });
