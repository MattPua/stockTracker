import StockListItem from './StockListItem';
import Helper from '../other/apphelper';
import './StocksList.scss';
class StocksList extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    $(this.refs.dropdown).dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
      }
    );
  }
  getStockListItems(type=''){
    let stockListItems = [];
    for (let stock of this.props.stocks){
      stockListItems.push(
        <StockListItem 
          name={stock.name} symbol={stock.symbol} ask={stock.ask} 
          bid={stock.bid} removeStock={this.props.removeStock} type={type} 
          change={stock.change} dayRange={stock.dayRange} price={stock.price}
          editStock={this.props.editStock} sharesOwned={stock.sharesOwned} targetPrice={stock.targetPrice}
          _id={stock._id} key={stock._id}
        />
      );
    }
    return stockListItems;
  }
  onClick(event){
    console.log('test');
    let prop = event.target.value;
    let direction = this.props.sortDirection;
    if (prop != this.props.sortBy)
      direction = 1;
    else{
      direction*=-1;
    }
    this.props.changeSortBy(prop,direction);
  }

  getPropertyNames(isForMobile){
    let listItems = [];
    let properties = ['name','symbol','price','targetPrice','sharesOwned','ask','bid','change'];
    for (let item of properties){
      if (isForMobile)
        listItems.push(
          <li>
            <a href="#!" onClick={this.onClick.bind(this)} value={item}>{Helper.toUpperOne(item)} 
              <i className="material-icons"  >swap_vert</i>
            </a>
          </li>
        );
      else
        listItems.push(
          <th data-field={item}>{Helper.toUpperOne(item)}<i value={item} className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
        );
    }
    if (isForMobile)
      return(
        <ul id='dropdown' className='dropdown-content'>
          {listItems}
        </ul>
      );
    else
      return[listItems];
  }

/*  getTableHeaders(){
    return(
      <th data-field='name'>Name<i value='name' className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
      <th data-field='symbol'>Symbol<i value='symbol' className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
      <th data-field='price'>Price<i value='price' className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
      <th data-field='targetPrice'>Target Price<i value='targetPrice' className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
      <th data-field='sharesOwned'>Shares Owned<i value='sharesOwned' className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
      <th data-field='ask'>Ask<i value='ask' className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
      <th data-field='bid'>Bid<i value='bid' className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
      <th data-field='change'>Change<i value='change' className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
      <th data-field='dayRange'>Day Range</th>
      <th data-field='actions'>Actions</th>
    );
  }*/

  render(){
    return(
      <div className="stocks-list-container row">
        <div className={"stocks-list hide-on-small-only " + this.props.className}>
          <table className={"bordered highlight responsive-table"}>
            <thead>
              <tr>
                {this.getPropertyNames()}
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
            <a className='dropdown-button btn' href='#' data-activates='dropdown' ref='dropdown'>Sort By:</a>
            {this.getPropertyNames(true)}
            {this.getStockListItems('mobile')}
          </div>
        </div>
      </div>
    );
  }
}

StocksList.defaultProps = {
  stocks        : [],
  sortDirection : 1,
  sortBy        : '',
};
StocksList.propTypes = {};

export default StocksList;