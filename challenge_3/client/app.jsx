
const ProgressBtn = ({ inProgress, nextForm, startCheckout, form, makePurchase }) => {
  if (!inProgress) {
    return <button type="button" onClick={() => {
        startCheckout();
        nextForm();
      }} className="btn btn-primary">Checkout</button>
  }
  return form === 4 ? <button type="button" onClick={makePurchase} className="btn btn-success">Purchase</button> :
   <button type="button" onClick={nextForm} className="btn btn-info">Next</button>;
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
    this.makePurchase = this.makePurchase.bind(this);
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

  makePurchase() {
    this.setState({
      inProgress: false,
      form: 0
    });
    alert("Sucker!!!");
  }

  render() {
    return (
      <div>
        <h1>Welcome to the Checkout</h1>
        <ProgressBtn
          makePurchase={this.makePurchase}
          form={this.state.form}
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
