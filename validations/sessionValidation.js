const Joi = require('@hapi/joi');

module.exports.sessionIDValidation = (data) => {
  const sessionValid = Joi.number().min(1).required();

  const { error } = sessionValid.validate(data);

  if (error) return { error: error.details[0].message };
  else return { error: false };
}

module.exports.sessionValidation = (data) => {
  const sessionValid = new Joi.object({
    session_group: Joi.array().required(),
    date_time: Joi.string().required(),
    duration: Joi.string().required(),
  });

  const { error } = sessionValid.validate(data);

  if (error) return { error: error.details[0].message };
  else return { error: false };
}

module.exports.sessionUpdateValidation = (data) => {
  const sessionValid = new Joi.object({
    session_group: Joi.array().required(),
    date_time: Joi.string().required(),
    duration: Joi.string().required(),
    mode: Joi.number().min(1).max(3).required(),
    paid: Joi.boolean().required(),
  });

  const { error } = sessionValid.validate(data);

  if (error) return { error: error.details[0].message };
  else return { error: false };
}
