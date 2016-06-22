import ReactDOM from 'react-dom';
import Header from './Components/Header';
import Searchbar from './Components/Searchbar';
import StocksList from './Components/StocksList';
import './other/main.scss';
require('materialize-css/sass/materialize.scss');
require('materialize-css/bin/materialize.js');
class App extends React.Component{
  constructor(props){
    super(props);
  }

  shouldComponentUpdate(nextProps,nextState){
    return true;
  }

  render(){
    return (
      <div>
        <Header/>
        <Searchbar/>
        <StocksList/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));