const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // TODO: aget all events
    res.status(500).send();
});

router.get('/:id', (req, res) => {
    // TODO: aget specific events
    res.status(500).send();
});

router.post('/add', (req, res) => {
    // TODO: add event
    // TODO: check input
    res.status(500).send();
});

router.put('/:id', (req, res) => {
    // TODO: update event
    res.status(500).send();
})

router.delete('/:id', (req, res) => {
    // TODO: delete event
    res.status(500).send()
})

module.exports = router;