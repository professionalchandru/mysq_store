const { con }                           = require("../db_config");

/**
 * Data store class for product collection
 * @class ProductModel
 */

class ProductModel {

  /**
   * This fuction will create new product
   * @param {object} _productObj
   * @returns {promise} new product
   * @memberof ProductModel
   * @async
   */

  async createProduct(_productObj, callback) {

    try {

      await con.query(

        `CALL insert_prod_proc (

                '${_productObj.name}',

                '${_productObj.category}',

                '${_productObj.price}',

                '${_productObj.quantity}',

                '${_productObj.description}'

               )`,
        (err, result) => {

          if (err) return callback(err);

          return callback(null, result);
        }
      );

    } catch (err) {

      return callback(err);

    }
  }

  /**
   * This fuction can used for edit already existing product
   * @param {object} _productObj
   * @returns {promise} update product
   * @memberof ProductModel
   * @async
   */

  async editProduct(_productObj, callback) {

    try {

      await con.query(

        `CALL update_prod_proc(

              '${_productObj.id}',

              '${_productObj.name}',

              '${_productObj.category}',

              '${_productObj.price}',

              '${_productObj.quantity}',

              '${_productObj.description}'

              )`,(err, reuslt) => {

          if (err) return callback(err);

          return callback(null, reuslt);
        }
      );
    } catch (err) {

      return callback(err);

    }
  }

  /**
   * This fuction will delete existing product
   * @param {string} _id
   * @returns {promise} delete product
   * @memberof ProductModel
   * @async
   */

  async deleteProduct(_id, callback) {

    try {

      let productRecord = await con.query(

        `CALL delete_prod_proc( ${_id})`, (err, result) => {

          if (err) callback(err);

          return callback(null, result);
        }
      );
    } catch (err) {

      return callback(err);

    }
  }

  /**
   * This fuction uses to search existing product
   * @param {object} _searchObj
   * @returns {promise} searched product
   * @memberof ProductModel
   * @async
   */

  async searchProduct(_searchObj, callback) {

    try {

      let sql = `CALL search_prod_by_name_proc('${_searchObj.name}')`;

      let productRecord = await con.query(sql, (err, result) => {

        if (err) {

          return callback(err);

        }
        return callback(null, result);

      });

    } catch (err) {

      return callback(err);

    }
  }

  /**
   * This fuction uses to search existing product
   * @param {string} _id
   * @returns {promise} searched product
   * @memberof ProductModel
   * @async
   */

  async searchProductById(_id, callback) {

    try {

      await con.query(`CALL search_prods_by_id_proc(${_id})`, (err, result) => {

        if (err) return callback(err);

        return callback(null, result);

      });

    } catch (err) {

      return callback(err);

    }
  }

  /**
   * This fuction uses to search existing product by email to change the likedUser array on mongodb
   * @param {object} _emailObj
   * @returns {promise}
   * @memberof ProductModel
   */

  async searchProductByEmail(_emailObj, callback) {

    try {

      let productRecord = await con.query(

        `CALL search_prod_by_like(${_emailObj.id},'${_emailObj.email}')`,

        (err, result) => {

          if (err) return callback(err);

          return callback(null, result);

        }
      );

    } catch (err) {

      return callback(err);
    }
  }

  /**
   * This fuction uses to like existing product
   * @param {object} _emailObj
   * @returns {promise}
   * @memberof ProductModel
   */

  async updateLikes(_emailObj, callback) {

    try {

      await con.query(

        `CALL update_prod_like_proc(${_emailObj.id}, '${_emailObj.email}')`,

        (err, result) => {

          if (err) return callback(err);


          return callback(null, result);
        }
      );

    } catch (err) {

      return callback(err);
    }
  }
}

let _productModelInstance = null;

/**
 * Instance of ProductModel
 * @param {object} name of the product
 * @returns {Promise} CURD operation of Products collection
 */

exports.productModelInstance = function () {
  if (!_productModelInstance) _productModelInstance = new ProductModel();

  return _productModelInstance;
};
