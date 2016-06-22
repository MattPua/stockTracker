require('./header.scss');

class Header extends React.Component {
  constructor(props){
    super(props);
  }

  shouldComponentUpdate(nextProps,nextState){
    return false;
  }

  render(){
    return(
      <div className="header">
      </div>
    );
  }
}

export default Header;