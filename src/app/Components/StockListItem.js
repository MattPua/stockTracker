class StockListItem extends React.Component{
  constructor(props){
    super(props);
  }
  onClick(){
    console.log(this.props.symbol);;
    this.props.removeStock(this.props.symbol);
  }

  render(){
    return(
      <tr className="stock-list-item-container">
        <td>{this.props.name}</td>
        <td>{this.props.symbol}</td>
        <td>{this.props.ask}</td>
        <td>{this.props.bid}</td>
        <td><button type='button' onClick={this.onClick.bind(this)}>DELETE</button></td>
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