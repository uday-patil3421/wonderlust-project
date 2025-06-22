const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().min(1).required(),
  location: Joi.string().trim().min(1).required(),
  country: Joi.string().trim().min(1).required(),
  price: Joi.number().min(0).required(),
  // image: Joi.string().trim().min(1).allow("", null),
  filter: Joi.string().trim().min(1).required(),
}).required();

module.exports.reviewSchema = Joi.object({
  rating: Joi.required(),
  comment: Joi.string().trim().min(1).required(),
}).required();
