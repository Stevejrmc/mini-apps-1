class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h1>Welcome to the Checkout</h1>
      </div>
    );
  }
}


const root = document.querySelector('#app');
ReactDOM.render(<App/>, root);
