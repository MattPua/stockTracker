import React from 'react';
import ReactDOM from 'react-dom';
import AwesomeComponent from './AwesomeComponent';
import Header from './Components/Header';

class App extends React.Component{
  constructor(props){
    super(props);
  }

  shouldComponentUpdate(nextProps,nextState){
  }

  render(){
    return (
      <div>
        <Header/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));