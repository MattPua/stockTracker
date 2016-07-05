import './Footer.scss';
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
            <a className="grey-text text-lighten-4 right" target='_blank' href="https://github.com/MattPua/stockTracker">
              <span className="fa-stack fa-lg">
                <i className="fa fa-circle fa-stack-2x"></i>
                <i className="fa fa-github-alt fa-stack-1x fa-inverse"></i>
              </span>
            </a>
          </div>
        </div>
      </footer>
    );
  }
}

Footer.defaultProps = {
  className: '',
};