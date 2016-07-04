class Searchbar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      query: ''
    };
  }
  onSubmit(event){
    event.preventDefault();
    if (this.state.query == '') return;
    this.props.searchStock(this.state.query);
    this.setState({query: ''});
  }
  onChange(event){
    this.setState({query: event.target.value});
  }
  render(){
    return(
      <div className="searchbar-container row">
        <div className={"searchbar " + this.props.className} >
            <form onSubmit={this.onSubmit.bind(this)} action='/quotes' method='POST'>
                <div className='input-field col s12'>
                  <label className='active' for='stock' data-error='Symbol Does Not Exist' data-success='Symbol Found'>Symbol</label>
                  <input className='validate' type="text" placeholder="Stock Name or Symbol" value={this.state.query} onChange={this.onChange.bind(this)} name='stock'/>
                </div>
                <div className='input-field col s12'>
                  <button type="submit" className='btn waves-effect waves-light'>
                    Search
                        <i className="material-icons right">search</i>
                  </button>
                </div>
            </form>
          </div>
      </div>
    );
  }

}
Searchbar.defaultProps = {};
Searchbar.propTypes = {};

export default Searchbar;