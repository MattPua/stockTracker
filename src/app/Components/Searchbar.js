class Searchbar extends React.Component{
  constructor(props){
    super(props);
  }

  onSubmit(event){
    event.preventDefault();
  }
  render(){
    return(
      <div className="searchbar-container">
        <div className="searchbar">
          <form onSubmit={this.onSubmit}>
            <input type="text" placeholder="Stock Name or Symbol"/>
            <button type="submit">Search</button>
          </form>
        </div>
      </div>
    );
  }

}
Searchbar.defaultProps = {};
Searchbar.propTypes = {};

export default Searchbar;