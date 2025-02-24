const express = require('express');
const router = express.Router();
const client = require('../config/db');
const { isSignedIn, isAdmin } = require('../validations/signedIn');
const { sessionValidation, sessionIDValidation, sessionUpdateValidation } = require('../validations/sessionValidation');

async function getPatient(id) {
  const query = {
    text: 'SELECT patient_id, last_name, first_name, date_of_birth FROM patient WHERE (patient_id = $1)',
    values: [id]
  };

  resp = await client.query(query)
  if (resp.rowCount !== 0) return resp.rows[0]
  else return {}
}

router.get('/', isAdmin, async (req, res) => {
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
            INNER JOIN means_of_payment ON means_of_payment.payment_mode_id = payment.payment_mode_id_fk`,
  }

  try {
    const dbRes = await client.query(query)


    let formatedData = dbRes.rows.map(el => {
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

    for(let i = 0; i < formatedData.length; i++) {
      for (let j = 0; j < formatedData[i].patients.length; j++) {
        if (formatedData[i].patients[j] != null) {
          formatedData[i].patients[j] = await getPatient(formatedData[i].patients[j])
        }
      }
    }

    console.log(formatedData)
    res.send(formatedData);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.get('/self', isSignedIn, (req, res) => {
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
            INNER JOIN means_of_payment ON means_of_payment.payment_mode_id = payment.payment_mode_id_fk
            WHERE (
              session_group.participant_1_id_fk = $1
              OR session_group.participant_2_id_fk = $1
              OR session_group.participant_3_id_fk = $1
            )`,
    values: [req.user.id]
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

router.get('/:id', isAdmin, (req, res) => {
  const { error } = sessionIDValidation(req.params.id);
  if (error) return res.status(400).send(error);

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
            INNER JOIN means_of_payment ON means_of_payment.payment_mode_id = payment.payment_mode_id_fk
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

router.post('/add', isAdmin, (req, res) => {
  const { error } = sessionValidation(req.body);
  if (error) return res.status(400).send(error);

  const query = {
    text: 'CALL add_session($1, $2, $3, $4, $5, $6)',
    values: [
      req.body.session_group[0],
      req.body.session_group[1],
      req.body.session_group[2],
      req.body.session_group.filter(_ => _ != null).length * 49.99,
      req.body.date_time,
      req.body.duration,
    ]
  }

  client.query(query)
    .then(() => {
      res.send(true);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.patch('/:id', isAdmin, (req, res) => {
  const { error } = sessionUpdateValidation(req.body);
  if (error) return res.status(400).send(error);

  const { idErr } = sessionIDValidation(req.body);
  if (idErr) return res.status(400).send(idErr);

  const query = {
    text: 'CALL update_session ($1, $2, $3, $4, $5, $6, $7, $8)',
    values: [
      req.params.id,
      req.body.session_group[0],
      req.body.session_group[1],
      req.body.session_group[2],
      req.body.session_group.filter(_ => _ != null).length * 49.99,
      req.body.mode,
      req.body.paid,
      req.body.date_time,
    ]
  }

  client.query(query)
      .then((dbRes) => {
        res.send(dbRes);
      })
      .catch(err => {
        res.status(500).send(err);
      });
});

router.delete('/:id', isAdmin, (req, res) => {
    const query = {
      text: 'CALL remove_session($1)',
      values: [req.params.id]
    }

    client.query(query)
      .then(() => {
        res.send(true);
      })
      .catch(err => {
        res.status(500).send(err);
      });
});

module.exports = router;
