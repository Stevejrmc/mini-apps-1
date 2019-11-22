
const ProgressBtn = ({ inProgress, nextForm, startCheckout }) => {
  if (!inProgress) {
    return <button type="button" onClick={() => {
        startCheckout();
        nextForm();
      }} className="btn btn-primary">Checkout</button>
  }
  return <button type="button" onClick={nextForm} className="btn btn-info">Next</button>
};

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inProgress: false,
      form: 0
    };
    this.startCheckout = this.startCheckout.bind(this);
    this.nextForm = this.nextForm.bind(this);
  }
  startCheckout() {
    this.setState({
      inProgress: true
    });
  }

  nextForm() {
    this.setState({
      form: this.state.form + 1
    });
  }

  render() {
    return (
      <div>
        <h1>Welcome to the Checkout</h1>
        <ProgressBtn
          inProgress={this.state.inProgress}
          startCheckout={this.startCheckout}
          nextForm={this.nextForm}
          />
      </div>
    );
  }
}


const root = document.querySelector('#app');
ReactDOM.render(<App />, root);
