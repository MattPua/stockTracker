export default class Header extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className='header-container row'>
        <div className={"" + this.props.className}>
          <h1>Stock Tracker</h1>
        </div>
      </div>
    );
  }
}

Header.defaultProps = {
  className: '',
};