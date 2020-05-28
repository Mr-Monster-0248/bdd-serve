const express = require('express');
const router = express.Router();
const client = require('../config/db');
const { isSignedIn, isAdmin } = require('../validations/signedIn');
const { sessionValidation } = require('../validations/sessionValidation');

router.get('/', isAdmin, (req, res) => {
  const query = {
    text: `SELECT
              session.session_id,
              session_group.participant_1_id_fk   AS Part_1,
              session_group.participant_2_id_fk   AS Part_2,
              session_group.participant_3_id_fk   AS Part_3,
              session.date_and_time,
              session.duration,
              payment.price,
              means_of_payment.mode,
              payment.paid
            FROM session
            INNER JOIN session_group ON session.group_id_fk = session_group.group_id
            INNER JOIN payment ON payment.payment_id = session.payment_id_fk
            INNER JOIN means_of_payment ON means_of_payment.payment_mode_id = payment.payment_mode_id`,
  }

  client.query(query)
    .then(dbRes => {
      const formatedData = dbRes.rows.map(el => {
        return {
          session_id: el.session_id,
          patients: [
            el.part_1,
            el.part_2,
            el.part_3,
          ],
          date_and_time: el.date_and_time,
          duration: el.duration,
          price: el.price,
          mode: el.mode,
          paid: el.paid,
        }

      })
      res.send(formatedData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });

});

router.get('/:id', (req, res) => {
    const query = {
    text: `SELECT
              session.session_id,
              session_group.participant_1_id_fk   AS Part_1,
              session_group.participant_2_id_fk   AS Part_2,
              session_group.participant_3_id_fk   AS Part_3,
              session.date_and_time,
              session.duration,
              payment.price,
              means_of_payment.mode,
              payment.paid
            FROM session
            INNER JOIN session_group ON session.group_id_fk = session_group.group_id
            INNER JOIN payment ON payment.payment_id = session.payment_id_fk
            INNER JOIN means_of_payment ON means_of_payment.payment_mode_id = payment.payment_mode_id
            WHERE session.session_id = $1`,
    values: [req.params.id]
  }

  client.query(query)
    .then(dbRes => {
      if (dbRes.rowCount === 0) return res.status(400).send('Wrong id');
      const formatedData = dbRes.rows.map(el => {
        return {
          session_id: el.session_id,
          patients: [
            el.part_1,
            el.part_2,
            el.part_3,
          ],
          date_and_time: el.date_and_time,
          duration: el.duration,
          price: el.price,
          mode: el.mode,
          paid: el.paid,
        }

      })
      res.send(formatedData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post('/add', isAdmin, async (req, res) => {
  const { error } = sessionValidation(req.body);
  if (error) return res.status(400).send(error);

  const price = 49.99 * req.body.session_group.length;
  const paymentQuery = {
    text: `INSERT INTO payment (price, payment_mode_id, paid)
            VALUES ($1 , 3, false)
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
        group_id,
        payment_id,
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
