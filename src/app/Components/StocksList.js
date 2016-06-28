import StockListItem from './StockListItem';
class StocksList extends React.Component{
  constructor(props){
    super(props);
  }
  getStockListItems(type=''){
    let stockListItems = [];
    for (let stock of this.props.stocks){
      stock = stock[stock.symbol];
      console.log(stock);
      stockListItems.push(
        <StockListItem 
          name={stock.name} symbol={stock.symbol} ask={stock.bid} 
          bid={stock.bid} removeStock={this.props.removeStock} type={type} 
          change={stock.change} dayRange={stock.dayRange}
        />
      );
    }

    return stockListItems;
  }

  render(){
    return(
      <div className="stocks-list-container row">
        <div className={"stocks-list hide-on-small-only " + this.props.className}>
          <table className={"bordered highlight responsive-table"}>
            <thead>
              <tr>
                <th data-field='name'>Name</th>
                <th data-field='symbol'>Symbol</th>
                <th data-field='ask'>Ask</th>
                <th data-field='bid'>Bid</th>
                <th data-field='change'>Change</th>
                <th data-field='dayRange'>Day Range</th>
                <th data-field='actions'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.getStockListItems()}
            </tbody>
          </table>
        </div>
        <div className={'stocks-list hide-on-med-and-up ' + this.props.className}>
          <div className='row'>
            {this.getStockListItems('mobile')}
          </div>
        </div>
      </div>
    );
  }
}

StocksList.defaultProps = {
  stocks: [],
};
StocksList.propTypes = {};

export default StocksList;