const Joi = require('@hapi/joi');

const loginValidation = (data) => {
  const loginValid = new Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = loginValid.validate(data);

  if (error) return { error: error.details[0].message };
  else return { error: false };
}

module.exports.loginValidation = loginValidation;
