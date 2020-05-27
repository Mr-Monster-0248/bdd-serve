const express = require('express');
const router = express.Router();
const client = require('../config/db');
const jwt = require('jsonwebtoken');

const { loginValidation } = require('../validations/authValidation');

router.post('/login-admin', (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error);

  const query = {
    text: 'SELECT admin_id, login, password FROM admin WHERE (login = $1)',
    values: [req.body.email]
  };

  client.query(query)
    .then(dbRes => {
      // check if the query is full
      if (dbRes.rowCount === 0) return res.status(401).send('Email or password incorrect');

      // check if the passords match
      if (dbRes.rows[0].password === req.body.password ) {
        const user = dbRes.rows[0];

        const token = jwt.sign({id: user.admin_id, admin: true}, process.env.TOKEN_SECRET);
        console.log('admin logged in');
        res.header('auth-token', token).send(token);
      } else {
        res.status(401).send('Email or password incorrect');
      }
    })
    .catch(e => {
      res.status(500).send(e);
    });
});

router.post('/login', (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error);

  const query = {
    text: 'SELECT patient_id, email, password FROM patient WHERE (email = $1)',
    values: [req.body.email]
  };

  client.query(query)
    .then(dbRes => {
      // check if the query is full
      if (dbRes.rowCount === 0) return res.status(401).send('Email or password incorrect');

      // check if the passords match
      if (dbRes.rows[0].password === req.body.password ) {
        const user = dbRes.rows[0];

        const token = jwt.sign({id: user.patient_id, admin: false}, process.env.TOKEN_SECRET);
        console.log('user logged in');
        res.header('auth-token', token).send(token);
      } else {
        res.status(401).send('Email or password incorrect');
      }
    })
    .catch(e => {
      res.status(500).send(e);
    });

});

router.get('/logout', (req, res) => {
    // TODO: logout user
    res.status(501).send();
});

module.exports = router;
