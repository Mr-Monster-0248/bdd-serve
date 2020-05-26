const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // TODO: get all patient
    res.status(500).send();
});

router.get('/:id', (req, res) => {
    // TODO: get specific patient
    res.status(500).send();
});

router.post('/add', (req, res) => {
    // TODO: add patient
    // TODO: check input
    res.status(500).send();
});

router.put('/:id', (req, res) => {
    // TODO: update patient
    res.status(500).send();
})

router.delete('/:id', (req, res) => {
    // TODO: delete patient
    res.status(500).send()
})

module.exports = router;