const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const config = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

const client = new Client(config);
client.connect(err => {
  if (err) console.log('Fail to connect database', err.stack);
  else console.log('DB connection success');
});

module.exports = client;
