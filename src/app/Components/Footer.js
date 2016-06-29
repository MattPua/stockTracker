export default class Footer extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <footer className="page-footer">
        <div className="footer-copyright">
          <div className="container">
            © 2016 Matthew Pua
            <a className="grey-text text-lighten-4 right" href="#!">More Links</a>
          </div>
        </div>
      </footer>
    );
  }
}

Footer.defaultProps = {
  className: '',
};