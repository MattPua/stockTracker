class StockListItem extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <tr className="stock-list-item-container">
        <td>Name</td>
        <td>Symbol</td>
        <td>Price</td>
      </tr>
    );
  }
}

StockListItem.defaultProps = {
  name: '',
  price: '',
  symbol: '',
};
StockListItem.propTypes = {};

export default StockListItem;