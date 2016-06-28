import ReactDOM from 'react-dom';
import Searchbar from './Components/Searchbar';
import StocksList from './Components/StocksList';
import SummaryBox from './Components/SummaryBox';
import Header from './Components/Header';
import Helper from './other/apphelper';
import './other/main.scss';
import moment from 'moment';
// Note: need this for materialize other wise won't work properly
var $ = window.jQuery = require('jquery');
require('materialize-css/sass/materialize.scss');
require('materialize-css/dist/js/materialize');
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      stocks: [],
      curr: 'CAD',
      lastUpdateTime: moment(),
    };
  }
  componentDidUpdate(prevProps,prevState){
  }
  componentDidMount(){
    this.getStocks();
  }
  searchStock(stock){
    let data = JSON.stringify({
      stock: stock
    });
    let that = this;
    let config = Helper.ajaxConfig('quotes','POST',data);
    Helper.ajaxCall(this, config, this.addStock);
  }

  getStocks(){
    let config = Helper.ajaxConfig('quotes','GET',null);
    Helper.ajaxCall(this,config, (data,that) =>{
      let stocks = [];
      for (let stock of data.stocks){
        let newStock = {};
        newStock[stock.symbol] = Helper.createObjectFromProperties(stock);
        stocks.push(newStock);
        newStock['symbol'] = stock.symbol;
      }
      that.setState({stocks: stocks});
      that.getUpdatedStockInfo();
    });
  }
  removeStock(symbol){
    let data = JSON.stringify({
      symbol: symbol
    });
    let config = Helper.ajaxConfig('quotes/delete','POST',data);
    Helper.ajaxCall(this,config,(result,that) =>{
      let existingItems = that.state.stocks;
      let foundItem = $.grep(existingItems,function(e){
        return e.symbol == result.symbol;
      });
      foundItem = foundItem[0];
      existingItems.splice(existingItems.indexOf(foundItem),1);
      that.setState({stocks:existingItems});
      Materialize.toast('Removed ' + symbol, 4000);
    });
  }

  addStock(obj,that){
    let details = obj.data;
    let stock = details[0];
    if (stock.name =='N/A') {Materialize.toast('That Stock Symbol does not exist!',4000); return;}
    for (let s of that.state.stocks)
      if (s[stock.symbol] != undefined) return;
    
    let data = JSON.stringify({
      symbol: stock.symbol,
      name: stock.name,
    });
    let config = Helper.ajaxConfig('quotes/new','POST',data);
    Helper.ajaxCall(this,config,(result)=>{
      Materialize.toast('Added ' + stock.name, 4000);
      that.getStocks();
    });
  }
  getUpdatedStockInfo(){
    // TODO:  move this to app.js
    let savedStocks = this.state.stocks;
    let stock = '';
    for (let i =0;i <savedStocks.length;i++){
      stock+=savedStocks[i]['symbol'];
      if (i!=savedStocks.length - 1)stock+="+";
    }
    let data = JSON.stringify({
      stock: stock
    });
    let config = Helper.ajaxConfig('quotes','POST',data);
    Helper.ajaxCall(this,config, (data,that) =>{
      let existingStocks = that.state.stocks;
      let updatedStocks = [];
      // TODO: THIS IS HORRENDOUS
      for (let stock of data.data){
        for (let s of existingStocks){
          if (s['symbol'] == stock.symbol){
            let updatedStock = {symbol: stock.symbol};
            updatedStock[stock.symbol] = $.extend({},stock,s[stock.symbol]);
            updatedStocks.push(updatedStock); 
          }
        }
      }
      console.log(updatedStocks);
      that.setState({stocks: updatedStocks, lastUpdateTime: moment()});
    });
  }

  render(){
    return (
      <div className=''>
        <Header className='col s12'/>
        <Searchbar  className='col s12'searchStock={this.searchStock.bind(this)} addStock={this.addStock.bind(this)}/>
        <SummaryBox className='col s12' refreshList={this.getStocks.bind(this)} lastUpdateTime={this.state.lastUpdateTime}/>
        <StocksList  className='col s12'stocks={this.state.stocks} removeStock={this.removeStock.bind(this)}/>
      </div>
    );
  }
}
window.moment = moment;

ReactDOM.render(<App/>, document.getElementById('app'));