import './navbar.scss';
export default class Navbar extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    $(this.refs.mobileDropdown).sideNav();
  }

  onClick(event){
    event.preventDefault();
    this.props.signout();
  }
  getIcons(){
    if (this.props.username!=null && this.props.username!='')
      return(
        <ul className="right hide-on-med-and-down">
          <li><a href="#!" onClick={this.onClick.bind(this)}><i className="material-icons right" >lock_open</i>Sign Out</a></li>
        </ul>
      );
    else return '';
  }

  getMobileNav(){
    return(
      <ul className="side-nav" id="mobile-nav">
        <li><a href="#!" onClick={this.onClick.bind(this)}><i className="material-icons right" >lock_open</i>Sign Out</a></li>
      </ul>
    );
  }

  render(){
    return(
      <nav className='navbar-container row'>
        <div className={"nav-wrapper " + this.props.className}>
          <a href="#!" className="brand-logo center">Portfolio Tracker</a>
          <a href="#" data-activates="mobile-nav" className="button-collapse" ref='mobileDropdown'><i className="material-icons">menu</i></a>
          {this.getIcons()}
          {this.getMobileNav()}
        </div>
      </nav>
    );
  }
}

Navbar.defaultProps = {
  className: '',
  username: null,
};