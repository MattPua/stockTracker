import _ from 'underscore';
class Searchbar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      query: '',
      errors: [],
      errorMessages:{
        stock: 'wrong',
      }
    };
  }
  isFormValid(){
    let errors = [];
    let errorMessages = _.extend({},this.state.errorMessages);
    if (this.state.query == '' || this.state.query == null)
      errors.push({key: 'stock',error: 'Please enter a stock symbol!'});


    if (errors.length){
      let i = 0;
      for (let e of errors){
        if (i++ == 0) $(this.refs[e.key]).focus();
        $(this.refs[e.key]).addClass('invalid');
        errorMessages[e.key] = e.error;
      }
    }

    this.setState({errors: errors,errorMessages: errorMessages});
    if (errors.length) return false;
    return true;
  }

  onSubmit(event){
    event.preventDefault();
    if (!this.isFormValid()) return;
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
                <div className='input-field col s12 m10'>
                  <i className='material-icons prefix'>search</i>
                  <label className='active' htmlFor='stock' data-error={this.state.errorMessages.stock} id='stock'>Symbol</label>
                  <input className='validate' ref='stock' type="text" placeholder="Stock Name or Symbol" value={this.state.query} onChange={this.onChange.bind(this)} name='stock'/>
                </div>
                <div className='input-field col s12 m2 right hide-on-small-only'>
                  <button type="submit" className='btn waves-effect waves-light'>Search</button>
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