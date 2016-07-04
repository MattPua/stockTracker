import ReactDOM from 'react-dom';
import Searchbar from './Components/Searchbar';
import StocksList from './Components/StocksList';
import SummaryBox from './Components/SummaryBox';
import Header from './Components/Header';
import Helper from './other/apphelper';
import FixedItems from './Components/FixedItems';
import Footer from './Components/Footer';
import Login from './Components/Login';
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
      username: null,
    };
  }
  componentDidUpdate(prevProps,prevState){
  }
  componentDidMount(){
    // this.getStocks();
  }
  searchStock(stock){
    let that = this;
    let config = Helper.ajaxConfig('quotes/search?symbol='+stock,'GET',null);
    Helper.ajaxCall(this, config, this.addStock);
  }
  componentDidUpdate(prevProps,prevState){
    if (this.state.username== null || this.state.username == '') return;

    if (prevState.sortBy != this.state.sortBy || prevState.sortDirection != this.state.sortDirection)
      this.getStocks();
  }

  editStock(symbol,properties){
    let data = JSON.stringify({properties: properties});
    //TODO: Should be ID
    let config = Helper.ajaxConfig('quotes/'+symbol,'POST',data);
    //TODO: Really inefficient process here
    Helper.ajaxCall(this,config,(data,that) =>{
      setTimeout(function(){
        that.getStocks();
      },1000);
    });
  }

  changeSortBy(property,direction){
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
      }
      stocks.sort(Helper.dynamicSort(that.state.sortBy,that.state.sortDirection));
      that.setState({stocks: stocks, lastUpdateTime: moment()});

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
    let stock = obj.data;
    if (stock.name =='N/A') {Materialize.toast('That Stock Symbol does not exist!',4000); return;}
    for (let s of that.state.stocks)
      if (s['symbol'] == undefined) return;
    
    let data = JSON.stringify({
      symbol: stock.symbol,
      name: stock.name,
      targetPrice: 0.00,
      sharesOwned: 0,
    });
    let config = Helper.ajaxConfig('quotes/new','POST',data);
    Helper.ajaxCall(this,config,(result)=>{
      Materialize.toast('Added ' + stock.name, 4000);
      that.getStocks();
    });
  }

  login(params,callback){
    let data = JSON.stringify({
      username: params.username,
      password: params.password,
    });
    let config = Helper.ajaxConfig('users','POST',data);
    Helper.ajaxCall(this,config,(result,that) =>{
      console.log(result);
      if (result.success){
        that.setState({
          username: result.username 
        });
        that.getStocks();
      }
      else callback(result.error);
    });
  }

  signup(params,callback){
    let data = JSON.stringify({
      username: params.username,
      password: params.password,
    });
    let config = Helper.ajaxConfig('users/new','POST',data);
    Helper.ajaxCall(this,config,(result) =>{
      if (result.success){
      }
      else callback(result.error);
    });
  }


  render(){
    if (this.state.username == null)
      return(
        <main>
          <Header className='col s12'/>
          <Login login={this.login.bind(this)} signup={this.signup.bind(this)}/>
          <Footer/>
        </main>
      );
    else 
      return (
        <main className=''>
          <Header className='col s12'/>
          <FixedItems refreshList={this.getStocks.bind(this)}/>
          <Searchbar  className='col s12'searchStock={this.searchStock.bind(this)} addStock={this.addStock.bind(this)}/>
          <SummaryBox className='col s12'  lastUpdateTime={this.state.lastUpdateTime} stocks={this.state.stocks}/>
          <StocksList  className='col s12'stocks={this.state.stocks} removeStock={this.removeStock.bind(this)} changeSortBy={this.changeSortBy.bind(this)}sortBy={this.state.sortBy} sortDirection={this.state.sortDirection} editStock={this.editStock.bind(this)}/>
          <Footer/>
        </main>
      );
  }
}
window.moment = moment;

ReactDOM.render(<App/>, document.getElementById('app'));