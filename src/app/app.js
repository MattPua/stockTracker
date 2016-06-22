import ReactDOM from 'react-dom';
import Header from './Components/Header';
import Searchbar from './Components/Searchbar';
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
        <Searchbar/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));