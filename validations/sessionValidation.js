const Joi = require('@hapi/joi');

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
