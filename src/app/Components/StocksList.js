import StockListItem from './StockListItem';
import Helper from '../other/apphelper';
import ReactDOM from 'react-dom';
import './StocksList.scss';
class StocksList extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    let that = this;
    $(this.refs.select).material_select();
    // Need this Hack because materializecss changes select into a input/ul and you can't attach the onClick's normally through React
    $(this.refs.mobileSortBy.querySelectorAll('ul.select-dropdown li')).on('click',(event)=>{
      this.onClick(null,this.refs.mobileSortBy.querySelector('input.select-dropdown').value);
    });
  }

  getStockListItems(type=''){
    let stockListItems = [];
    let defaultProperties = this.props.defaultProperties.slice(1,this.props.defaultProperties.length);
    for (let stock of this.props.stocks){
      stockListItems.push(
        <StockListItem 
           removeStock={this.props.removeStock} type={type} {...stock} editStock={this.props.editStock} 
           defaultProperties={defaultProperties} extraProperties={this.props.extraProperties}
        />
      );
    }
    return stockListItems;
  }
  onClick(event,value=''){
    let prop = null;
    // Need this for MaterializeCSS Select changes
    prop = value == '' ? event.target.value : Helper.toLowerOne(value);
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
    let properties = this.props.defaultProperties;
    for (let item of properties){
      if (isForMobile)
        listItems.push(
          <option value={item}>{Helper.toUpperOne(item)}</option>
        );
      else
        listItems.push(
          <th data-field={item}>{Helper.toUpperOne(item)}<i value={item} className='material-icons' onClick={this.onClick.bind(this)}>swap_vert</i></th>
        );
    }
    if (isForMobile)
      return[
        <form ref='mobileSortBy'>
          <div className="input-field">
            <select ref='select' defaultValue='name'>
              <option value="" disabled>Sort By:</option>
              {listItems}
            </select>
            <label>Sort By:</label>
          </div>
        </form>
      ];
    else
      return[listItems];
  }

  render(){
    return(
      <div className="stocks-list-container row">
        <div className={"stocks-list hide-on-small-only " + this.props.className}>
          <table className={"bordered highlight responsive-table"}>
            <thead>
              <tr>
                {this.getPropertyNames()}
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
  defaultProperties: ['name','price','sharesOwned','targetPrice','priceChange','marketValue','bookValue','volume','change','profit'],
  extraProperties: ['ask','bid','dayRange','yearRange','dividendYield','dividendPerShare','dividendPayDate','exDividendDate'],
};
StocksList.propTypes = {};

export default StocksList;