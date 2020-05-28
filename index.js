const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (_, res) => {
    res.send('This is the server side for the database project');
});

const auth = require('./routes/auth');
app.use('/auth', auth);

const patient = require('./routes/patient');
app.use('/patient', patient);

const session = require('./routes/session');
app.use('/session', session);

// starting the server
const PORT = process.env.PORT || 3000;
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
