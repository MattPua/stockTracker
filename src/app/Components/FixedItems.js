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
{/*        <div className="fixed-action-btn">
          <a className="btn-floating btn-large red">
            <i className="large material-icons">mode_edit</i>
          </a>
          <ul>
            <li><a className="btn-floating red"><i className="material-icons">insert_chart</i></a></li>
            <li><a className="btn-floating yellow darken-1"><i className="material-icons">format_quote</i></a></li>
            <li><a className="btn-floating green"><i className="material-icons">publish</i></a></li>
            <li><a className="btn-floating blue"><i className="material-icons">attach_file</i></a></li>
          </ul>
        </div>*/}
              
      </div>
    );
  }
}

FixedItems.defaultProps = {
  className: '',
};
