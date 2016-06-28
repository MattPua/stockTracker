import StockListItem from './StockListItem';
import './StocksList.scss';
class StocksList extends React.Component{
  constructor(props){
    super(props);
  }
  getStockListItems(type=''){
    let stockListItems = [];
    for (let stock of this.props.stocks){
      stock = stock[stock.symbol];
      stockListItems.push(
        <StockListItem 
          name={stock.name} symbol={stock.symbol} ask={parseFloat(stock.bid).toFixed(2)} 
          bid={parseFloat(stock.bid).toFixed(2)} removeStock={this.props.removeStock} type={type} 
          change={stock.change} dayRange={stock.dayRange} price={parseFloat(stock.price).toFixed(2)}
        />
      );
    }
    return stockListItems;
  }
  onClick(event){
    let prop = event.target.value;
    let direction = this.props.sortDirection;
    if (prop != this.props.sortBy)
      direction = 1;
    else{
      direction*=-1;
    }
    this.props.changeSortBy(prop,direction);
  }

  render(){
    return(
      <div className="stocks-list-container row">
        <div className={"stocks-list hide-on-small-only " + this.props.className}>
          <table className={"bordered highlight responsive-table"}>
            <thead>
              <tr>
                <th data-field='name'>Name<i value='name' className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
                <th data-field='symbol'>Symbol<i value='symbol' className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
                <th data-field='price'>Price<i value='price' className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
                <th data-field='ask'>Ask<i value='ask' className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
                <th data-field='bid'>Bid<i value='bid' className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
                <th data-field='change'>Change<i value='change' className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
                <th data-field='dayRange'>Day Range></th>
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
  sortDirection: 1,
  sortBy: '',
};
StocksList.propTypes = {};

export default StocksList;