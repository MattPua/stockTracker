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

    // Only do something if they save i guess
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
    // TODO: Should be ID instead
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
          <label for='targetPrice'  className='hide-on-small-only'>Target Price</label>
          <input type='text' value={this.state.targetPrice}  placeholder='Target Price' name='targetPrice' onChange={this.onTargetPriceChange.bind(this)}/>
        </td>,
        <td>  
          <label for='sharesOwned' className='hide-on-small-only'>Shares Owned</label>
          <input type='text' value={this.state.sharesOwned} placeholder='Shares Owned' name='sharesOwned' onChange={this.onSharesOwnedChange.bind(this)}/>
        </td>
      ];
    }
    else{
      return[
        <td>
          <span >${this.state.targetPrice}</span>
        </td>,
        <td>
          <span >{this.state.sharesOwned}</span>
        </td>
      ];
    }
  }

  getTableHeaders(){
    let properties = ['price','targetPrice','sharesOwned','ask','bid','volume','change','dayRange'];
    let th = [];
    for (let p of properties){
      th.push(
        <th data-field={p}>{Helper.toUpperOne(p)}</th>
      )
    }
    return(
      <tr>
        {th}
      </tr>
    );
  }

  getValues(){
    let change             = this.props.change.split(' ');
    let changeAmount       = parseFloat(change[0]);
    let parsedChangeAmount = (changeAmount > 0 ? '$' : '-$') + Math.abs(changeAmount).toFixed(2);
    let changePercent      = parseFloat(change[2].replace('%','')).toFixed(2);
    let dayRange           = this.props.dayRange.split(' ');
    let parsedDayRange     = "$"+dayRange[0] + ' - '+ dayRange[2];
    let volume             = Helper.getRoundedUnit(this.props.volume);
    let name               = this.props.name;
    return[
      <td>${this.props.price}</td>,
      this.getEditableParts(),
      <td>${this.props.ask}</td>,
      <td>${this.props.bid}</td>,
      <td>{volume}</td>,
      <td className={changeAmount > 0  ? 'hide-on-med-and-up green-text text-darken-3' : 'hide-on-med-and-up red-text text-darken-1'}>{parsedChangeAmount} [ {changePercent}% ]</td>,
      <td className={changeAmount > 0  ? 'hide-on-small-only green-text text-darken-3' : 'hide-on-small-only red-text text-darken-1'}>{parsedChangeAmount}<br/>{changePercent}%</td>,
      <td>{parsedDayRange}</td>
    ];
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
             <span className="card-title activator grey-text text-darken-4 truncate">{Helper.toUpperFirstLetterOnly(this.props.name)}<i className="material-icons right">more_vert</i></span>
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
            {this.getActions()}
          </div>
          <div className="card-reveal">
             <span className="card-title grey-text text-darken-4">{Helper.toUpperFirstLetterOnly(this.props.name)}<i className="material-icons right">close</i></span>
             <p>Here is some more information about this product that is only revealed once clicked on.</p>
          </div>
        </div>
      </div>
    );
  }

  getDesktopAndTablet(){
    return(
      <tr className={"stock-list-item-container " + this.props.className} ref='item'>
        <td className='truncate'>{Helper.toUpperFirstLetterOnly(this.props.name)}</td>
        <td>{this.props.symbol}</td>
        {this.getValues()}
        <td>
          {this.getActions()}
        </td>
      </tr>
    );
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
};
StockListItem.propTypes = {};

export default StockListItem;