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
      <div className="stocks-list-container row">
        <table className={"stocks-list bordered highlight responsive-table " + this.props.className}>
          <thead>
            <tr>
              <th data-field='name'>Name</th>
              <th data-field='symbol'>Symbol</th>
              <th data-field='ask/bid'>Ask/Bid</th>
              <th data-field='actions'>Actions</th>
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