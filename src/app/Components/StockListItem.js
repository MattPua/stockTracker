class StockListItem extends React.Component{
  constructor(props){
    super(props);
  }
  onClick(){
    this.props.removeStock(this.props.symbol);
  }
  componentDidMount(){
    $(document).ready( () =>{
      $(this.refs.item).find(".tooltipped").tooltip({});
    });
  }

  render(){
    return(
      <tr className={"stock-list-item-container " + this.props.className} ref='item'>
        <td>{this.props.name}</td>
        <td>{this.props.symbol}</td>
        <td>${this.props.ask}/${this.props.bid}</td>
        <td>
          <button className='btn waves-effect waves-light' type='button' onClick={this.onClick.bind(this)}>
            <i className='material-icons tooltipped' data-position='top' data-delay='50' data-tooltip={'Remove ' + this.props.name}>delete</i>
          </button>
        </td>
      </tr>
    );
  }
}

StockListItem.defaultProps = {
  name: '',
  ask: '',
  bid: '',
  symbol: '',
  className: '',
};
StockListItem.propTypes = {};

export default StockListItem;