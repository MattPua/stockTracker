import StockListItem from './StockListItem';
class StocksList extends React.Component{
  constructor(props){
    super(props);
  }

  getStocks(){
    return(
      <StockListItem/>
    );
  }

  render(){
    return(
      <div className="stocks-list-container">
        <table className="stocks-list">
          <thead>
            <tr>
              <th>Name</th>
              <th>Symbol</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {this.getStocks()}
          </tbody>
        </table>
      </div>
    );
  }
}

StocksList.defaultProps = {};
StocksList.propTypes = {};

export default StocksList;