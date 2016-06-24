class StockListItem extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <tr className="stock-list-item-container">
        <td>{this.props.name}</td>
        <td>{this.props.symbol}</td>
        <td>{this.props.ask}</td>
        <td>{this.props.bid}</td>
      </tr>
    );
  }
}

StockListItem.defaultProps = {
  name: '',
  ask: '',
  bid: '',
  symbol: '',
};
StockListItem.propTypes = {};

export default StockListItem;