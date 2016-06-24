import StockListItem from './StockListItem';
class StocksList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      items: [],
    };
  }
  componentDidUpdate(prevProps,prevState){
    if (prevProps.stocks!= this.props.stocks)
      this.getUpdatedStockInfo();
  }
  getUpdatedStockInfo(){
    let stock = '';
    for (let i =0;i <this.props.stocks.length;i++){
      stock+=this.props.stocks[i];
      if (i!=this.props.stocks.length - 1)stock+="+";
    }
    let data = JSON.stringify({
      stock: stock
    });
    let that = this;
    $.ajax({
      url: 'quotes',
      type: 'POST',
      dataType: "json",
      data:data,
      contentType: 'application/json',
      success: function(result){
        let stocks=[];
        for (let stock of result.data){
          let newStock = <StockListItem name={stock.name} symbol={stock.symbol} ask={stock.bid} bid={stock.bid}/>;
          stocks.push(newStock);
        }
        that.setState({items: stocks});
      },
      error: function(err){
        console.error(err);
      }
    });
  }


  render(){
    return(
      <div className="stocks-list-container">
        <table className="stocks-list">
          <thead>
            <tr>
              <th>Name</th>
              <th>Symbol</th>
              <th>Ask</th>
              <th>Bid</th>
            </tr>
          </thead>
          <tbody>
            {this.state.items}
          </tbody>
        </table>
      </div>
    );
  }
}

StocksList.defaultProps = {
  stocks: [],
};
StocksList.propTypes = {};

export default StocksList;