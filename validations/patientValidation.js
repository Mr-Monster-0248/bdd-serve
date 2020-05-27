const Joi = require('@hapi/joi');

module.exports.patientIDValidation = (data) => {
  const patientValid = Joi.number().min(1).required();

  const { error } = patientValid.validate(data);

  if (error) return { error: error.details[0].message };
  else return { error: false };
}

module.exports.patientValidation = (data) => {
  const patientValid = new Joi.object({
    last_name: Joi.string().required(),
    first_name: Joi.string().required(),
    date_of_birth: Joi.string()
      .pattern(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\d\d$/)
      .required(),
    address: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    gender: Joi.number().min(0).max(2),
    age_category: Joi.number().min(0).max(4),
    discovery_id_fk: Joi.number().min(1).max(4),
  });

  const { error } = patientValid.validate(data);

  if (error) return { error: error.details[0].message };
  else return { error: false };
}
