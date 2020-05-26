const express = require('express');
const Joi = require('@hapi/joi')

const app = express();
app.use(express.json());


app.get('/', (_, res) => {
    res.send('This is the server side for the database project');
});

const patient = require('./routes/patient');
app.use('/patient', patient);

const auth = require('./routes/auth');
app.use('/auth', auth);

const event = require('./routes/event');
app.use('/event', event);

// starting the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));


// const valideReq = (reqBody) => {
//     const schemat = Joi.object({
//         test: Joi.string().required(),
//         id: Joi.number(),
//     });

//     const { error } = schemat.validate(reqBody);
//     if (error) return { error: error.details[0].message };
//     return { error: false };
// }