import './navbar.scss';
export default class Navbar extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
  }

  componentDidUpdate(prevProps,prevState){
    // Needed to reactivate the plugin when logged in
    if (prevProps.username!=this.props.username && this.props.username!=null)
      $(this.refs.mobileDropdown).sideNav();
    // Force hide the navbar so overlay goes away 
    else if (prevProps.username!=this.props.username && this.props.username == null)
      $(this.refs.mobileDropdown).sideNav('hide');
  }

  onClick(event){
    event.preventDefault();
    this.props.signout();
  }
  getIcons(){
    if (this.props.username!=null && this.props.username!='')
      return(
        <ul className="right hide-on-med-and-down">
          <li className='active truncate'>
            <a className='valign-wrapper' href="#!">
              <span className='name valign'>{this.props.username[0]}</span>
              <span>{this.props.username}</span>
            </a>
          </li>
          <li className="divider"></li>
          <li><a href="#!" onClick={this.onClick.bind(this)}><i className="material-icons right" >lock_open</i>Sign Out</a></li>
        </ul>
      );
    else return '';
  }

  getMobileNav(){
    if (this.props.username!=null && this.props.username!='')
      return[
        <a href="#" data-activates="mobile-nav" className="button-collapse" ref='mobileDropdown'><i className="material-icons">menu</i></a>,
        <ul className="side-nav" id="mobile-nav">
          <li className='active truncate'>
            <a className='valign-wrapper' href="#!">
              <span className='name valign left'>{this.props.username[0]}</span><span>{this.props.username}</span>
            </a>
          </li>
          <li className="divider"></li>
          <li><a href="#!" onClick={this.onClick.bind(this)}><i className="material-icons right" >lock_open</i>Sign Out</a></li>
        </ul>
      ];
    else return '';
  }

  render(){
    return(
      <nav className='navbar-container row'>
        <div className={"nav-wrapper " + this.props.className}>
          <a href="#!" className="brand-logo center">Portfolio Tracker</a>
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