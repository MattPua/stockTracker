import './header.scss';
export default class Header extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className='header-container row'>
        <div className={"header " + this.props.className}>
          <h1 className='center-align'>Portfolio Tracker</h1>
        </div>
      </div>
    );
  }
}

Header.defaultProps = {
  className: '',
};