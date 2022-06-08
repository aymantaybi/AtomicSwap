const express = require('express');
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const trades = require('./trades');
const charts = require('./charts');

const app = express();
const port = 4000;

app.set('trust proxy', true);

app.use(express.json());

app.use(helmet({ contentSecurityPolicy: false }));

//app.use(compression({ level: 9 }));

app.use(cors({ origin: '*', credentials: true, optionSuccessStatus: 200 }));

app.use('/trades', trades);
app.use('/charts', charts);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})