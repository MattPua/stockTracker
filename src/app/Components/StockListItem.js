import './StockListItem.scss';
import Helper from '../other/apphelper';
class StockListItem extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      editMode: false,
      targetPrice: this.props.targetPrice,
      sharesOwned: this.props.sharesOwned,
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      targetPrice: this.props.targetPrice,
      sharesOwned: this.props.sharesOwned,
    });
  }
  componentWillUnmount(){
    $(this.refs.item).find(".tooltipped").tooltip('remove');
    $(this.refs.itemMobile).find(".tooltipped").tooltip('remove');
  }

  onDelete(){
    this.props.removeStock(this.props._id);
  }

  onEdit(){
    this.setState({editMode: !this.state.editMode});
  }

  componentDidMount(){
    $(this.refs.item).find(".tooltipped").tooltip({});
    $(this.refs.itemMobile).find(".tooltipped").tooltip({});
  }
  onTargetPriceChange(event){
    let value = event.target.value;
    value = value.replace(/[^0-9.]/, "");
    //TODO: Prevent multiple dots
    //TODO: Ensure if there's a dot,there's at least one number after it

    this.setState({
      targetPrice: value,
    });
  }

  onSharesOwnedChange(event){
    let value = event.target.value;
    value = value.replace(/[^0-9.]/, "");
    //TODO: Prevent multiple dots
    //TODO: Ensure if there's a dot,there's at least one number after it
    this.setState({
      sharesOwned: value,
    });
  }

  saveChanges(){
    this.onEdit();
    if (parseFloat(this.props.targetPrice).toFixed(2) == parseFloat(this.state.targetPrice).toFixed(2) && 
      parseInt(this.props.sharesOwned) == parseInt(this.state.sharesOwned)) return;
    this.props.editStock(this.props._id,this.state);
  }

  cancelChanges(){
    this.setState({
      targetPrice: this.props.targetPrice,
      sharesOwned: this.props.sharesOwned,
    });
    this.onEdit();
  }

  getEditableParts(){
    let content = null;
    if (this.state.editMode){
      return[
        <td>  
          <label for='sharesOwned' className='hide-on-small-only'>Shares Owned</label>
          <input type='text' value={this.state.sharesOwned} placeholder='Shares Owned' name='sharesOwned' onChange={this.onSharesOwnedChange.bind(this)}/>
        </td>,
        <td>
          <label for='targetPrice'  className='hide-on-small-only'>Target Price</label>
          <input type='text' value={this.state.targetPrice}  placeholder='Target Price' name='targetPrice' onChange={this.onTargetPriceChange.bind(this)}/>
        </td>
      ];
    }
    else{
      return[
        <td><span >{this.state.sharesOwned}</span></td>,
        <td><span >${this.state.targetPrice}</span></td>
      ];
    }
  }

  getAdditionalInformation(){
    let extraInfo = this.props.extraProperties;
    let html = [];
    for (let i of extraInfo){
      let value = this.props[i];
      if (i == 'dividendYield' && value!='N/A') value = value+'%';
      else if (i =='dividendPerShare' && value!='N/A') value = '$'+value;
      else if (i == 'yearRange' || i =='ask' || i =='bid' || i=='dayRange') value = '$' + value; 
      html.push(
        <li className='collection-item'>
          <div>
            <span>{Helper.toUpperOne(i)}:</span><span className='right'>{value}</span> 
          </div>
        </li>);
    }
    return html;
  }

  getTableHeaders(){
    let properties = this.props.defaultProperties;
    let th = [];
    for (let p of properties)
      th.push(<th data-field={p}>{Helper.toUpperOne(p)}</th>)
    return(<tr>{th}</tr>);
  }

  getValues(){
    let properties = this.props.defaultProperties;
    let td = [];
    let targetPrice = parseFloat(this.props['targetPrice']);
    let redTextClassName = ' red-text text-darken-1';
    let greenTextClassName = ' green-text text-darken-3';
    for (let p of properties){
      let val = this.props[p];
      let returnVal = null;
      let hideMed = 'hide-on-med-and-up ';
      let hideSmall = 'hide-on-small-only ';
      if (p == 'volume') val = Helper.getRoundedUnit(val);
      else if (p =='change' || p == 'priceChange' || p =='profit'){
        let percent='',parsedPercent='0.00%';
        let amount = parseFloat(val);
        let parsedAmount = Helper.getParsedValue(amount);
        if (p == 'change') parsedPercent = Helper.getParsedValue(amount*100,'%',(parseFloat(this.props.price)));
        else if (p =='priceChange') parsedPercent = targetPrice == 0 ? '0.00%' : Helper.getParsedValue(amount,'%',targetPrice);
        else if (p == 'profit') parsedPercent = targetPrice == 0 ? '0.00%' : Helper.getParsedValue(amount,'%',(targetPrice*parseFloat(this.props.sharesOwned)));

        if (amount > 0 ){
          hideMed+= greenTextClassName;
          hideSmall+= greenTextClassName;
        }
        else if (amount < 0){
          hideMed+= redTextClassName;
          hideSmall+= redTextClassName;
        }
        returnVal = [
          <td className={hideMed}>{parsedAmount} [ {parsedPercent} ]</td>,
          <td className={hideSmall}>{parsedAmount}<br/>{parsedPercent}</td>,
        ];
      }
      else if (p =='marketValue' || p =='bookValue' || p =='price') val = '$' + (parseFloat(val).toFixed(2));
      else if (p=='profit') val = Helper.getParsedValue(val);
      else if (p == 'sharesOwned') returnVal = this.getEditableParts();
      else if (p =='targetPrice') continue;
      td.push(returnVal == null ? <td>{val}</td> : returnVal);
    }
    return td;
  }
  getActions(){
    let name = this.props.name;
    return[
      <button className={'btn waves-effect waves-light ' + (this.state.editMode? 'hide': '')} type='button' onClick={this.onEdit.bind(this)}>
        <i className='material-icons tooltipped' data-position='top' data-delay='50' data-tooltip={'Edit ' + name}>edit</i>
      </button>,
      <button className={'btn waves-effect waves-light ' + (this.state.editMode? '': 'hide')} type='button' onClick={this.saveChanges.bind(this)}>
        <i className='material-icons tooltipped' data-position='top' data-delay='50' data-tooltip={'Save Changes'}>save</i>
      </button>,
      <button className={'btn waves-effect waves-light ' + (this.state.editMode? '': 'hide')} type='button' onClick={this.cancelChanges.bind(this)}>
        <i className='material-icons tooltipped' data-position='top' data-delay='50' data-tooltip={'Cancel Changes'}>cancel</i>
      </button>,
      <button className={'btn waves-effect waves-light ' + (this.state.editMode? 'hide': '')} type='button' onClick={this.onDelete.bind(this)}>
        <i className='material-icons tooltipped' data-position='top' data-delay='50' data-tooltip={'Remove ' + name}>delete</i>
      </button>
    ];
  }

  getMobile(){
    return(
      <div className={'stock-list-item-container mobile-only ' + this.props.className} ref='itemMobile'>
        <div className="card">
{/*            <div className="card-image waves-effect waves-block waves-light">
            <div className="activator">Activator</div>
          </div>*/}
          <div className="card-content">
             <span className="card-title activator grey-text text-darken-4 truncate">{this.props.name}<i className="material-icons right">more_vert</i></span>
             <div className="row">
               <div className={"hide-on-med-and-up "}>
                 <table className={"bordered highlight responsive-table"}>
                   <thead>
                    {this.getTableHeaders()}
                   </thead>
                   <tbody>
                    <tr>
                      {this.getValues()}
                    </tr>
                   </tbody>
                 </table>
               </div>
             </div>
             <hr/>
            {this.getActions()}
          </div>
          <div className="card-reveal">
             <span className="card-title grey-text text-darken-4">{Helper.toUpperFirstLetterOnly(this.props.name)}<i className="material-icons right">close</i></span>
             <ul className='collection'>
              {this.getAdditionalInformation()}
             </ul>
          </div>
        </div>
      </div>
    );
  }

  getDesktopAndTablet(){
    return(
      <tr className={"stock-list-item-container " + this.props.className} ref='item'>
        <td className='truncate'>
          <span>{this.props.symbol}</span>
          <br/>
          {this.props.name}
        </td>
        {this.getValues()}
        <td>
          {this.getActions()}
        </td>
      </tr>
    );
  }

  static getNoItemsToShow(type=''){
    let returnVal = [];
    if (type == 'mobile')
      returnVal.push(
        <div className={'stock-list-item-container mobile-only'}>
          <div className="card">
            <div className="card-content">
               <span className="card-title activator grey-text text-darken-4 truncate">No Stocks to Show</span>
            </div>
          </div>
        </div>
      );
    else
      returnVal.push(
        <tr>
          <td colSpan='11' className='center'>No Stocks To Show</td>
        </tr>
      );
  return returnVal;
  }

  render(){

    if (this.props.type == 'mobile')
      return this.getMobile();
    else
      return this.getDesktopAndTablet();  
  }
}

StockListItem.defaultProps = {
  name: '',
  ask: 0.00,
  bid: 0.00,
  symbol: '',
  className: '',
  change: '0 - %0',
  dayRange: '0 - 0',
  targetPrice: 0.00,
  sharesOwned: 0,
  price: 0.00,
  _id: '',
  defaultProperties: ['price','change','sharesOwned','targetPrice','priceChange','marketValue','bookValue','volume','profit'],
  extraProperties: ['ask','bid','dayRange','yearRange','dividendYield','dividendPerShare','dividendPayDate','exDividendDate'],
};
StockListItem.propTypes = {};

export default StockListItem;