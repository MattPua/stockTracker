export default class Login extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: 'guest',
      password: 'guest',
    };
  }

  signup(event){
    event.preventDefault();
    // TODO: Should display errors
    if (this.state.username == '' || this.state.password == '') return;
    this.props.signup({
      username: this.state.username,
      password: this.state.password,
    });
  }

  login(event){
    event.preventDefault();
    this.props.login({
      username: this.state.username,
      password: this.state.password,
    });
  }

  onPasswordChange(event){
    let value = event.target.value;
    this.setState({
      password: value
    });
  }

  onUserChange(event){
    let value = event.target.value;
    this.setState({
      username: value
    });
  }

  render(){
    return(
      <div className='login-container'>
        <div className='login row'>
          <form className="col s12" >
            <h3 className='center'>Login Page</h3>
            <div className="row">
              <div className="input-field col s12">
                <input id="username" type="text" className="validate" value={this.state.username} onChange={this.onUserChange.bind(this)}/>
                <label for="username">Username</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input id="password" type="password" className="validate" value={this.state.password} onChange={this.onPasswordChange.bind(this)}/>
                <label for="password">Password</label>
              </div>
            </div>
            <button className="btn waves-effect waves-light" type="submit" name="action" onClick={this.login.bind(this)}>Login
              <i className="material-icons right">send</i>
            </button>
            <button className="btn waves-effect waves-light" type="submit" name="action" onClick={this.signup.bind(this)}>Sign up
              <i className="material-icons right">send</i>
            </button>
          </form>
        </div>
      </div>
    );
  }
}

Login.defaultProps = {
  className: 'col s12',
};
