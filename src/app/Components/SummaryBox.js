import moment from 'moment';
import Helper from '../other/apphelper';
class SummaryBox extends React.Component{
  constructor(props){
    super(props);
  }

  onClick(){
    this.props.refreshList();
  }

  render(){
    let lastUpdateTime = this.props.lastUpdateTime.format(Helper.getMomentFormat());
    return(
      <div className='summary-box-container row'>
        <div className={'summary-box ' + this.props.className}>
          <div className='row'>
            <span className='col s12 m6'>
              Last Updated: {lastUpdateTime}
            </span>
            <span className='col s12 m6'></span>
          </div>
        </div>
      </div>

    );
  }

}

SummaryBox.defaultProps = {
  className: '',
  lastUpdateTime: ''
};

export default SummaryBox;