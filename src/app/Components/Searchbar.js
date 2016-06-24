class Searchbar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      query: ''
    };
  }

  onSubmit(event){
    event.preventDefault();
    let data = JSON.stringify({
      stock: this.state.query
    });
    let that = this;
    $.ajax({
      url: 'quotes',
      type: 'POST',
      dataType: "json",
      data:data,
      contentType: 'application/json',
      success: function(result){
        that.props.addStock(result);
      },
      error: function(err){
        console.error(err);
      }
    });
  }
  onChange(event){
    this.setState({query: event.target.value});
  }
  render(){
    return(
      <div className="searchbar-container">
        <div className="searchbar">
          <form onSubmit={this.onSubmit.bind(this)} action='/quotes' method='POST'>
            <input type="text" placeholder="Stock Name or Symbol" value={this.state.query} onChange={this.onChange.bind(this)} name='stock'/>
            <button type="submit">Get Quote</button>
          </form>
        </div>
      </div>
    );
  }

}
Searchbar.defaultProps = {};
Searchbar.propTypes = {};

export default Searchbar;