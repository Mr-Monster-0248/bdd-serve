const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    // TODO: login user
    res.status(500).send();
});

router.get('/logout', (req, res) => {
    // TODO: logout user
    res.status(500).send();
});

module.exports = router;
