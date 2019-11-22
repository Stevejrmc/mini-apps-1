// Buttons
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

// Forms
const CreateAcctForm = ({ handleAcct, acctInfo }) => (
  <div className="acct-form">
    <div className="form-group">
      <label htmlFor="name">Name</label>
      <input type="text" value={acctInfo.name} onChange={e => handleAcct(e)} className="form-control" id="name" placeholder="Enter full name"/>
    </div>
    <div className="form-group">
      <label htmlFor="email">Email address</label>
      <input type="email" value={acctInfo.email} onChange={e => handleAcct(e)} className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email"/>
      <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone.</small>
    </div>
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <input type="password" value={acctInfo.password} onChange={e => handleAcct(e)} className="form-control" id="password" placeholder="Password"/>
    </div>
  </div>
);

const ContactInfoForm = ({ handleContact, contactInfo }) => (
  <div className="contact-info">
    <div className="form-group">
      <label htmlFor="address">Address</label>
      <input type="text" value={contactInfo.line} onChange={e => handleContact(e)} className="form-control" id="address" placeholder="1234 Main St"/>
    </div>
    <div className="form-group">
      <label htmlFor="address2">Address 2</label>
      <input type="text" value={contactInfo.line2} onChange={e => handleContact(e)} className="form-control" id="address2" placeholder="Apartment, studio, or floor"/>
    </div>
    <div className="form-row">
      <div className="form-group col-md-6">
        <label htmlFor="city">City</label>
        <input type="text" value={contactInfo.city} onChange={e => handleContact(e)} className="form-control" id="city"/>
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="state">State</label>
        <select onChange={e => handleContact(e)} id="state" className="form-control">
          <option>Choose...</option>
          <option>...</option>
        </select>
      </div>
      <div className="form-group col-md-2">
        <label htmlFor="zip">Zip</label>
        <input type="text" value={contactInfo.zip} onChange={e => handleContact(e)} className="form-control" id="zip"/>
      </div>
    </div>
  </div>
);

const PaymentForm = ({ handlePayment, paymentInfo }) => (
  <div className="payment-form form-row">
    <div className="form-group col-md-3">
      <label htmlFor="credit-card">Credit Card</label>
      <input type="text" value={paymentInfo.creditCard} onChange={e => handlePayment(e)} className="form-control" id="credit-card"/>
    </div>
    <div className="form-group col-md-2">
      <label htmlFor="expiration">Expiration</label>
      <input type="text" value={paymentInfo.exp} onChange={e => handlePayment(e)} className="form-control" id="expiration"/>
    </div>
    <div className="form-group col-md-2">
      <label htmlFor="cvv">CVV</label>
      <input type="text" value={paymentInfo.securityCode} onChange={e => handlePayment(e)} className="form-control" id="cvv"/>
    </div>
    <div className="form-group col-md-2">
      <label htmlFor="billing-zip">Billing zip</label>
      <input type="text" value={paymentInfo.zip} onChange={e => handlePayment(e)} className="form-control" id="billing-zip"/>
    </div>
  </div>
);

const Confirmation = () => (
  <p>
    It's official we got yo money now! Ha ha. Blah blah blah bacon Lorem ipsum dolor sit amet,
    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
);

const FormGenerator = ({ form, data, handleChange }) => {
  let currentForm = form < 2 ? <CreateAcctForm acctInfo={data} handleAcct={handleChange}/> :
      (form < 3 ? <ContactInfoForm contactInfo={data} handleContact={handleChange}/>
      : <PaymentForm paymentInfo={data} handlePayment={handleChange}/>);
  return (
    <div className="Form">
      { form > 3 ? <Confirmation/> : currentForm }
    </div>
  );
};

// Welcome
const Welcome = () => (
  <p>
    Thanks for deciding to give me your money. Blah blah blah bacon Lorem ipsum dolor sit amet,
    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
);

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inProgress: false,
      form: 0,
      name: '',
      email: '',
      password: '',
      line: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
      creditCard: '',
      exp: '',
      securityCode: '',
      zip: ''
    };
    this.startCheckout = this.startCheckout.bind(this);
    this.nextForm = this.nextForm.bind(this);
    this.makePurchase = this.makePurchase.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
  }

  handleChange(e) {
    // meta data will be form & input identifier object
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  render() {
    return (
      <div>
        <h1>Welcome to the Checkout</h1>
        { this.state.inProgress ? <FormGenerator
          data={this.state}
          handleChange={this.handleChange}
          form={this.state.form}
          />
        : <Welcome/> }
        <ProgressBtn
          nextForm={this.nextForm}
          startCheckout={this.startCheckout}
          makePurchase={this.makePurchase}
          inProgress={this.state.inProgress}
          form={this.state.form}
          />
      </div>
    );
  }
}


const root = document.querySelector('#app');
ReactDOM.render(<App />, root);
