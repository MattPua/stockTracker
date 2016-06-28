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
            <span className='col s12 m4'>
              Last Updated: {lastUpdateTime}
            </span>
            <span className='col s12 m4'>
              
            </span>
            <span className='col s12 m4'>
              <button className='btn waves-effect waves-light' type='button' onClick={this.onClick.bind(this)}>
                <i className='material-icons tooltipped' data-position='top' data-delay='50' data-tooltip='Refresh'>refresh</i>
              </button>
            </span>
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