import StockListItem from './StockListItem';
class StocksList extends React.Component{
  constructor(props){
    super(props);
  }
  getStockListItems(){
    let stockListItems = [];
    for (let stock of this.props.stocks){
      stock = stock[stock.symbol];
      console.log(stock);
      stockListItems.push(
        <StockListItem name={stock.name} symbol={stock.symbol} ask={stock.bid} bid={stock.bid} removeStock={this.props.removeStock}/>
      );
    }

    return stockListItems;
  }

  render(){
    return(
      <div className="stocks-list-container">
        <table className="stocks-list">
          <thead>
            <tr>
              <th>Name</th>
              <th>Symbol</th>
              <th>Ask</th>
              <th>Bid</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.getStockListItems()}
          </tbody>
        </table>
      </div>
    );
  }
}

StocksList.defaultProps = {
  stocks: [],
};
StocksList.propTypes = {};

export default StocksList;