const express = require('express');
const router = express.Router();
const client = require('../config/db');
const { isSignedIn, isAdmin } = require('../validations/signedIn');
const { sessionValidation } = require('../validations/sessionValidation');

router.get('/', isAdmin, (req, res) => {
    res.status(501).send();
});

router.get('/:id', (req, res) => {
    // TODO: aget specific events
    res.status(501).send();
});

router.post('/add', isAdmin, async (req, res) => {
  const { error } = sessionValidation(req.body);
  if (error) return res.status(400).send(error);

  const price = 49.99 * req.body.session_group.length;
  const paymentQuery = {
    text: `INSERT INTO payment (price, payment_mode_id, paid)
            VALUES ($1 , null, false)
            RETURNING payment_id;`,
    values: [price],
  }

  const groupQuery = {
    text: `INSERT INTO session_group
              (
                participant_1_id_fk,
                participant_2_id_fk,
                participant_3_id_fk
              )
            VALUES ($1, $2, $3)
            RETURNING group_id;`,
    values: req.body.session_group,
  }

  try {
    let dbRes = await client.query(paymentQuery);
    const payment_id = dbRes.rows[0].payment_id;

    dbRes = await client.query(groupQuery);
    const group_id = dbRes.rows[0].group_id;

    await client.query({
      text: `INSERT INTO session
                (
                  date_and_time,
                  duration,
                  group_id_fk,
                  payment_id_fk
                )
              VALUES ($1, $2, $3, $4);`,
      values: [
        req.body.date_time,
        req.body.duration,
        payment_id,
        group_id,
      ]
    });

    res.send(true);
  } catch(err) {
    console.error(err);
    res.status(500).send(err)
  }

  // TODO: add event
  // TODO: check input
  res.status(501).send();
});

router.put('/:id', (req, res) => {
    // TODO: update event
    res.status(501).send();
})

router.delete('/:id', (req, res) => {
    // TODO: delete event
    res.status(501).send()
})

module.exports = router;
