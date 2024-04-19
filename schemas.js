const Joi = require('joi');

const listingSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    image: Joi.string().allow("", null),
    country: Joi.string().required()
})

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required()
    }).required(),
})
module.exports = {
    listingSchema: listingSchema,
    reviewSchema: reviewSchema
};
