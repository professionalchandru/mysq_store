const Joi                               = require('@hapi/joi');

let Product = {

  /**
 * Add new product validation
 * @returns validated request
 * @param {object} product_details
 */

  add: (data) => {

    const schema = Joi.object().keys({

      name: Joi.string().min(3).max(255).required().trim(),
      category: Joi.string().min(3).max(255).required().trim(),
      price: Joi.number().min(1).required(),
      quantity: Joi.number().min(1).required(),
      description: Joi.string().min(3).max(255).trim(),

    });

    return schema.validate(data);
  },

  /**
 * Edit product validation for already available product
 * @returns validated request
 * @param {object} product_details
 */

  edit: (data) => {

    const schema = Joi.object().keys({

      name: Joi.string().min(3).max(255).required().trim(),
      category: Joi.string().min(3).max(255).required().trim(),
      price: Joi.number().min(1).required(),
      quantity: Joi.number().min(1).required(),
      description: Joi.string().min(3).max(255).trim(),

    });

    return schema.validate(data);
  },

  /**
 * Search already existing product validation
 * @returns validated request
 * @param {string} product_name
 */

  search: (data) => {

    const schema = Joi.object().keys({

      name: Joi.string().trim().min(3).max(255).required().trim()

    })
    return schema.validate(data);
  },


}

let User = {

  /**
 * Register validation
 * @returns validated request
 * @param {object} user_details
 */

  register: (data) => {

    const schema = Joi.object().keys({

      name: Joi.string().min(3).max(255).required().trim(),
      email: Joi.string().min(3).max(255).email().required().trim(),
      password: Joi.string().min(6).required().trim(),

    });

    return schema.validate(data);
  },

  /**
 * Login validation
 * @returns validated request
 * @param {object} user_details
 */

  login: (data) => {

    const schema = Joi.object().keys({

      email: Joi.string().min(3).max(255).email().required().trim(),
      password: Joi.string().min(6).required().trim()

    });

    return schema.validate(data);
  }
}

module.exports = { Product, User }
