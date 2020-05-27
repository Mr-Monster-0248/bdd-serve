const express = require('express');
const router = express.Router();
const client = require('../config/db');

const { isAdmin } = require('../validations/signedIn');
const { patientValidation, patientIDValidation } = require('../validations/patientValidation');

router.get('/', isAdmin, (req, res) => {
  const query = {
    text: 'SELECT patient_id, last_name, first_name FROM patient'
  };

  client.query(query)
    .then(dbRes => {
      res.send(dbRes.rows)
    })
    .catch(err => {
      res.status(500).send(err);
    })
});

router.get('/:id', isAdmin, (req, res) => {
  const { error } = patientIDValidation(req.params.id);
  if (error) return res.status(400).send(error);

  const query = {
    text: 'SELECT patient_id, last_name, first_name FROM patient WHERE (patient_id = $1)',
    values: [req.params.id]
  };

  client.query(query)
    .then(dbRes => {
      if (dbRes.rowCount === 0) return res.status(400).send('Wrong id');
      res.send(dbRes.rows)
    })
    .catch(err => {
      res.status(500).send(err);
    })
});

router.post('/add', isAdmin, (req, res) => {
  const { error } = patientValidation(req.body);
  if (error) return res.status(400).send(error);

  const query = {
    text: `INSERT INTO patient
      (
        last_name,
        first_name,
        date_of_birth,
        address,
        email,
        password,
        gender,
        age_category,
        discovery_id_fk
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    values: [
      req.body.last_name,
      req.body.first_name,
      req.body.date_of_birth,
      req.body.address,
      req.body.email,
      req.body.password,
      req.body.gender,
      req.body.age_category,
      req.body.discovery_id_fk,
    ]
  }

  client.query(query)
    .then(() => {
      res.send(true)
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(false);
    });
});

router.put('/:id', (req, res) => {
    // TODO: update patient
    res.status(501).send();
})

router.delete('/:id', isAdmin, (req, res) => {
  const { error } = patientIDValidation(req.params.id);
  if (error) return res.status(400).send(error);

  const query = {
    text: 'DELETE FROM patient WHERE (patient_id = $1)',
    values: [req.params.id]
  };

  client.query(query)
    .then(dbRes => {
      if (dbRes.rowCount === 0) return res.status(400).send(false);
      res.send(true);
    })
    .catch(err => {
      res.status(500).send(err);
    })
})

module.exports = router;
