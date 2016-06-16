import React from 'react';

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
        <h1>HEADER</h1>
        <h3>SMALLER TEXT</h3>
        <p>TESXT</p>
      </div>
    );
  }
}

export default Header;