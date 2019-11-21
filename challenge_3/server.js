const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const PORT = 3000;

// Database Setup
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://127.0.0.1:27017/checkout', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
  creditCard: String
});
const Transaction = mongoose.model('Transaction', transactionSchema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:8080'}));



app.get('/', (req, res) => {
  Transaction.find({}).then(sales => {
    res.status(200).send(sales);
  }).catch(err => {
    res.status(400).send(err);
  });
});

app.post('/', (req, res) => {
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

app.put('/:id', (req, res) => {
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
