//validation
const Joi = require("@hapi/joi");

//register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

//login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

//Arctile validation
const articleValidation = (data) => {
  const stock = Joi.object().keys({
    state: Joi.string().required(),
    quantity: Joi.number().required(),
  });
  const schema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    category: Joi.string().required(),
    stock: Joi.array().items(stock).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.articleValidation = articleValidation;
