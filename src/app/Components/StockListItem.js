import './StockListItem.scss';
class StockListItem extends React.Component{
  constructor(props){
    super(props);
  }
  onClick(){
    this.props.removeStock(this.props.symbol);
  }
  componentDidMount(){
    $(document).ready( () =>{
      $(this.refs.item).find(".tooltipped").tooltip({});
      $(this.refs.itemMobile).find(".tooltipped").tooltip({});
    });
  }

  getValues(){
    let change = this.props.change.split(' ');
    let changeAmount = parseFloat(change[0]);
    let parsedChangeAmount = changeAmount > 0 ? '$' : '-$' + Math.abs(changeAmount);
    let changePercent = parseFloat(change[2].replace('%',''));
    let dayRange = this.props.dayRange.split(' ');
    let parsedDayRange = "$"+dayRange[0] + ' - '+ dayRange[2];
    return[
    <td>${this.props.ask}</td>,
    <td>${this.props.bid}</td>,
    <td className={changeAmount > 0  ? 'hide-on-med-and-up green-text darken-3' : 'hide-on-med-and-up red-text darken-1'}>{parsedChangeAmount} [{changePercent}%]</td>,
    <td className={changeAmount > 0  ? 'hide-on-small-only green-text darken-3' : 'hide-on-small-only red-text darken-1'}>{parsedChangeAmount}<br/>{changePercent}%</td>,
    <td>{parsedDayRange}</td>
    ];
  }
  getActions(){
    return(
      <button className='btn waves-effect waves-light' type='button' onClick={this.onClick.bind(this)}>
        <i className='material-icons tooltipped' data-position='top' data-delay='50' data-tooltip={'Remove ' + this.props.name}>delete</i>
      </button>
    );
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
                     <tr>
                       <th data-field='ask'>Ask/Bid</th>
                       <th data-field='bid'>Bid</th>
                       <th data-field='change'>Change</th>
                       <th data-field='dayRange'>Day Range</th>
                     </tr>
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
             <span className="card-title grey-text text-darken-4">{this.props.name}<i className="material-icons right">close</i></span>
             <p>Here is some more information about this product that is only revealed once clicked on.</p>
          </div>
        </div>
      </div>
    );
  }

  getDesktopAndTablet(){
    return(
      <tr className={"stock-list-item-container " + this.props.className} ref='item'>
        <td className='truncate'>{this.props.name}</td>
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
  ask: '',
  bid: '',
  symbol: '',
  className: '',
  change: '0 - %0',
  dayRange: '0 - 0',
};
StockListItem.propTypes = {};

export default StockListItem;