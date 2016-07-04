module.exports=function(app,db){
  let userRoutes = require('./user')(app,db);
  let quotesRoutes = require('./quotes')(app,db);
}