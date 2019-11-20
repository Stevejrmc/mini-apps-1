const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:8080'}));

app.get('/', (req, res) => {
  res.status(200).send('Welcome to the checkout experience! \nOur API under construction...');
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
