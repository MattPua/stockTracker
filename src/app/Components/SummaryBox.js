import moment from 'moment';
import Helper from '../other/apphelper';
import './SummaryBox.scss';
class SummaryBox extends React.Component{
  constructor(props){
    super(props);
  }

  onClick(){
    this.props.refreshList();
  }

  getTotalProfit(){
    let total = 0.00;
    for (let s of this.props.stocks){
      total+=parseFloat(s.profit);
    }
    return total;
  }
  getTotalProfitPercentage(){
    let totalProfit = 0.00;
    let totalBookValue = 0.00;
    for (let s of this.props.stocks){
      totalProfit+=parseFloat(s.profit);
      totalBookValue+=parseFloat(s.bookValue);
    }
    let percentage =  totalBookValue > 0 ? ( (totalProfit/totalBookValue)*100).toFixed(2) : 0.00;
    return percentage;
  }
  getDayProfit(){
    let total = 0.00;
    for (let s of this.props.stocks){
      if (!s.sharesOwned) continue;
      total+=(parseFloat(s.targetPrice) - parseFloat(s.open));
    }
    return total;
  }
  getTotalBookValue(){
    let total = 0.00;
    for (let s of this.props.stocks){
      total+=parseFloat(s.bookValue);
    }
    return total;
  }

  getTotalMarketValue(){
    let total = 0.00;
    for (let s of this.props.stocks){
      total+=parseFloat(s.marketValue);
    }
    return total;
  }


  render(){
    let lastUpdateTime   = this.props.lastUpdateTime.format(Helper.getMomentFormat());
    let totalMarketValue = this.getTotalMarketValue();
    let totalBookValue   = this.getTotalBookValue();
    let dayProfit        = this.getDayProfit();
    let totalProfit      = this.getTotalProfit();
    let profitPercentage = this.getTotalProfitPercentage();
    return(
      <div className='summary-box-container row'>
        <div className={'summary-box ' + this.props.className}>
          <div className='row'>
            <span className='col s12'>
              Last Updated: {lastUpdateTime}
            </span>
          </div>
          <div className='row'>
            <div className="col s12 m6 highlight-box">
              <div className>
                <h5>Total Market Value:</h5>
                <div>{Helper.getParsedValue(totalMarketValue,'$',null,false)}<i className='material-icons'>{dayProfit > 0 ? 'trending_up' : (dayProfit == 0 ? 'trending_flat' : 'trending_down')}</i></div>
              </div>
              <div className>
                <h5>Total Book Value:</h5>
                <div>{Helper.getParsedValue(totalBookValue,'$',null,false)}</div>
              </div>
            </div>
            <div className="col s12 m6 highlight-box">
              <div className>
                <h5>Today's Profit:</h5>
                <div>{Helper.getParsedValue(dayProfit)}</div>
              </div>
              <div className>
                <h5>Overall Profit:</h5>
                <div>{Helper.getParsedValue(totalProfit)}<i className='material-icons'>{dayProfit > 0 ? 'trending_up' : (dayProfit == 0 ? 'trending_flat' : 'trending_down')}</i></div>
                <div>{Helper.getParsedValue(profitPercentage,'%',null)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }

}

SummaryBox.defaultProps = {
  className: '',
  lastUpdateTime: '',
  stocks: [],
};

export default SummaryBox;