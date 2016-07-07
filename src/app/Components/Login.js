import _ from 'underscore';
export default class Login extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: 'guest',
      password: 'guest',
      errors: [],
      errorMessages:{
        username: 'wrong',
        password: 'wrong',
      }
    };
  }

  isFormValid(){
    let errors = [];
    let errorMessages = _.extend({},this.state.errorMessages);
    if (this.state.username == '' || this.state.username == null)
      errors.push({key: 'username',error: 'Username cannot be empty!'});
    if (this.state.password == '' || this.state.password == null)
      errors.push({key: 'password',error:'Password cannot be empty!'});


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

  signup(event){
    event.preventDefault();
    if (!this.isFormValid()) return;
    this.props.signup({
      username: this.state.username,
      password: this.state.password,
    },function(error){
      console.error(error);
      Materialize.toast(error, 4000);
    });
  }

  login(event){
    event.preventDefault();
    if (!this.isFormValid()) return;
    this.props.login({
      username: this.state.username,
      password: this.state.password,
    },function(error){
      console.error(error);
      Materialize.toast(error, 4000);
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
      <div className='login-container container'>
        <div className='login row'>
          <form className="col s12" >
            <h3 className='center'>Login</h3>
            <div className="row">
              <div className="input-field col s12">
                <input id="username" type="text" className="validate" value={this.state.username} ref='username' onChange={this.onUserChange.bind(this)}/>
                <label className='active' htmlFor="username" data-error={this.state.errorMessages.username}>Username</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input id="password" type="password" className="validate" value={this.state.password} ref='password' onChange={this.onPasswordChange.bind(this)}/>
                <label className='active' htmlFor="password" data-error={this.state.errorMessages.password}>Password</label>
              </div>
            </div>
            <button className="btn waves-effect waves-light" type="submit" name="action" onClick={this.login.bind(this)}>Login
              <i className="material-icons right">send</i>
            </button>
            <button className="btn waves-effect waves-light right" type="submit" name="action" onClick={this.signup.bind(this)}>Sign up
              <i className="material-icons right">perm_identity</i>
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
