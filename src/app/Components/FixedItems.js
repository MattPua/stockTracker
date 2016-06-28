export default class FixedItems extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className='fixed-items-container'>
        <div className="fixed-action-btn" >
          <a className="btn-floating btn red waves-effect waves-light" onClick={this.props.refreshList}>
            <i className='material-icons tooltipped' data-position='top' data-delay='50' data-tooltip='Refresh'>refresh</i>
          </a>
        </div>
      </div>
    );
  }
}

FixedItems.defaultProps = {
  className: '',
};
