const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const PORT = 3000;

// Database Setup
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://127.0.0.1:27017/checkout', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
  useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("Connected to mongodb...");
});

// Schema/Model
const transactionSchema = new Schema({
  name: String,
  email: String,
  password: String,
  address: Schema.Types.Mixed,
  billing: Schema.Types.Mixed
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));


// Routes
app.post('/transactions', (req, res) => {
  var sale = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };
  Transaction.create(sale).then(confirm => {
    console.log('Confirmation: ', confirm);
    res.status(201).send(confirm._id);
  }).catch(err => {
    res.status(404).end();
  });
});

app.put('/transactions/:id', (req, res) => {
  var updates = {};
  for(var p in req.body) {
    updates[p] = req.body[p];
  }
  Transaction.updateOne({ _id: req.params.id }, updates).then(confirm => {
    res.status(201).send();
  }).catch(err => {
    res.status(404).send(err);
  });
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
