import Avatar from './components/Avatar';
import Background from './components/Background';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Background />
        <div className="center">
          <Avatar />
          <h1>I'm Samuel Li</h1>
          <p>An enthusiastic 13-year old programmer</p>
          <a href="mailto:samuelli4521@gmail.com" className="contact-button">Contact Me</a>
        </div>
    	</div>)
  }

};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);