import ReactDOM from 'react-dom';
import Searchbar from './Components/Searchbar';
import StocksList from './Components/StocksList';
import SummaryBox from './Components/SummaryBox';
import Header from './Components/Header';
import Helper from './other/apphelper';
import FixedItems from './Components/FixedItems';
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
      sortDirection: 1,
      sortBy: 'name',
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
  componentDidUpdate(prevProps,prevState){
    if (prevState.sortBy != this.state.sortBy || prevState.sortDirection != this.state.sortDirection)
      this.getUpdatedStockInfo();
  }

  editStock(symbol,properties){
    console.info(symbol,properties);
    let data = JSON.stringify({properties: properties});
    //TODO: Should be ID
    let config = Helper.ajaxConfig('quotes/'+symbol,'POST',data);
    //TODO: Really inefficient process here
    Helper.ajaxCall(this,config,(data,that) =>{
      that.getStocks();
    });
  }

  changeSortBy(property,direction){
    property = Helper.toLowerOne(property);
    //TODO: Make sure its a good property to sort by
    let updatedStocks = this.state.stocks.slice(0);
    updatedStocks = updatedStocks.sort(Helper.dynamicSort(property,direction));
    this.setState({stocks: updatedStocks,sortBy: property,sortDirection: direction});
  }

  getStocks(){
    let config = Helper.ajaxConfig('quotes','GET',null);
    Helper.ajaxCall(this,config, (data,that) =>{
      let stocks = [];
      for (let stock of data.stocks){
        let newStock = {};
        newStock = Helper.createObjectFromProperties(stock);
        stocks.push(newStock);
        // newStock['symbol'] = stock.symbol;
      }
      that.setState({stocks: stocks});
      that.getUpdatedStockInfo();
    });
  }
  removeStock(id){
    let config = Helper.ajaxConfig('quotes/'+id+'/delete','POST',{});
    Helper.ajaxCall(this,config,(result,that) =>{
      let existingItems = that.state.stocks;
      let foundItem = $.grep(existingItems,function(e){
        return e._id == result.id;
      });
      foundItem = foundItem[0];
      existingItems.splice(existingItems.indexOf(foundItem),1);
      that.setState({stocks:existingItems});
      Materialize.toast('Removed ' + foundItem.symbol, 4000);
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
      targetPrice: 0.00,
      sharesOwned: 0
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
    let query = '';
    for (let i =0;i <savedStocks.length;i++){
      query+=savedStocks[i]['symbol'];
      if (i!=savedStocks.length - 1)query+="+";
    }
    let data = JSON.stringify({
      stock: query
    });
    let config = Helper.ajaxConfig('quotes','POST',data);
    Helper.ajaxCall(this,config, (data,that) =>{
      let existingStocks = that.state.stocks;
      let updatedStocks = [];
      // TODO: THIS IS HORRENDOUS
      for (let stock of data.data){
        for (let s of existingStocks){
          if (s['symbol'] == stock.symbol){
            // let updatedStock = {symbol: stock.symbol};
            let updatedStock = $.extend({},stock,s);
            updatedStocks.push(updatedStock); 
          }
        }
      }
      updatedStocks.sort(Helper.dynamicSort(that.state.sortBy,that.state.sortDirection));
      that.setState({stocks: updatedStocks, lastUpdateTime: moment()});
    });
  }

  render(){
    return (
      <div className=''>
        <Header className='col s12'/>
        <FixedItems refreshList={this.getStocks.bind(this)}/>
        <Searchbar  className='col s12'searchStock={this.searchStock.bind(this)} addStock={this.addStock.bind(this)}/>
        <SummaryBox className='col s12'  lastUpdateTime={this.state.lastUpdateTime}/>
        <StocksList  className='col s12'stocks={this.state.stocks} removeStock={this.removeStock.bind(this)} changeSortBy={this.changeSortBy.bind(this)}sortBy={this.state.sortBy} sortDirection={this.state.sortDirection} editStock={this.editStock.bind(this)}/>
      </div>
    );
  }
}
window.moment = moment;

ReactDOM.render(<App/>, document.getElementById('app'));