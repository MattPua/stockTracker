import ReactDOM from 'react-dom';
import Header from './Components/Header';
import Searchbar from './Components/Searchbar';
import StocksList from './Components/StocksList';
import './other/main.scss';
require('materialize-css/sass/materialize.scss');
require('materialize-css/bin/materialize.js');
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      stocks: [],
    };
  }

  shouldComponentUpdate(nextProps,nextState){
    return true;
  }
  componentDidMount(){
    this.getStocks();
  }

  getStocks(){
    let that = this;
    $.ajax({
      url: 'quotes',
      type: 'GET',
      dataType: "json",
      contentType: 'application/json',
      success: function(results){
        console.log(results);
        let stocks = [];
        for (let stock of results.stocks){
          stocks.push(stock.symbol);
        }
        that.setState({stocks: stocks});
      },
      error: function(err){
        console.error(err);
      }
    });
  }
  addStock(stock){
    console.log(stock);
    let details = stock.data.split(',');
    if (details.indexOf('N/A')>=0) return;
    console.log(details);
    let symbol = details[0];
    // Strip away any extra quotes
    symbol = symbol.replace(/"/g,'');
    let name = details[1];
    name = name.replace(/"/g,"");
    if (this.state.stocks.indexOf(symbol)>=0) return;
    let existingStocks = this.state.stocks.slice(0);
    existingStocks.push(symbol);
    this.setState({stocks: existingStocks});

    let data = JSON.stringify({
      symbol: symbol,
      name: name,
    });
    let that = this;
    $.ajax({
      url: 'quotes/new',
      type: 'POST',
      dataType: "json",
      data:data,
      contentType: 'application/json',
      success: function(result){
        console.log(result);
      },
      error: function(err){
        console.error(err);
      }
    });
  }

  render(){
    return (
      <div>
        <Header/>
        <Searchbar addStock={this.addStock.bind(this)}/>
        <StocksList stocks={this.state.stocks}/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));