const router                            = require("express").Router();

const redis                             = require("redis");

const client                            = redis.createClient();

const { con }                           = require("../db_config");

//import product model
const { productModelInstance }          = require("../models/productmodel");

//import validatation for products
const { Product }                       = require("../validation");

//Import JWT tokens as authentication middleware
const auth                              = require("../middlewares/auth");

const productInstance                   = productModelInstance();

/**
 * End point for add products user interface
 * @async
 */

router.get("/insert", auth, async (req, res) => {

  res.render("addproducts");

});

/**
 * End point for create new product
 * @async
 * @returns {Promise} new product
 * @
 */

router.post("/insert", auth, async (req, res) => {

  //Validate products
  const validate = Product.add(req.body);

  if (validate.error == null) {

    try {

      const verifyProductData = {

        name: req.body.name

      };

      let search = await productInstance.searchProduct(

        verifyProductData,

        (err, result) => {

          if (err) throw err;

          if (result[0].length > 0) {

            return res.render("addproducts", {

              error: verifyProductData.name + " is already available",

            });
          } else {

            let productData = {

              name: req.body.name,

              category: req.body.category,

              price: req.body.price,

              quantity: req.body.quantity,

              description: req.body.description,

            };
            productInstance.createProduct(productData, (err, result) => {

              if (err) throw err;

              res.status(200).render("addproducts", {

                success: productData.name + " is added successfully",

              });
            });
          }
        }
      );
    } catch (err) {

      if (err) {

        console.log(err);

        res.status(400).render("addproducts", { error: err });

      }
    }
  } else {

    console.log(validate.error.message);

    res.status(400).render("addproducts", { error: validate.error.message });

  }
});

/**
 * End point for search products userinterface
 *@async
 */

router.get("/search", auth, async (req, res) => {

  res.render("search");

});

/**
 * End point for search products form Products collection
 * @async
 * @returns {Promise} searched product
 */

router.post("/search", auth, async (req, res, next) => {

  //Validate proucts using joi
  const validate = Product.search(req.body);

  if (validate.error == null) {

    try {

      const verifyProductData = {

        name: req.body.name,

      };
      await productInstance.searchProduct(verifyProductData, (err, result) => {

        if (err) throw err;

        if (result[0].length < 1) {

          return res.render("search", {

            error: verifyProductData.name + " is not available",

          });

        } else {

          //Data should fill in viewproducts handlebars
          let product = result[0][0];

          let id = product.id;

          let like = String(id);

          let pname = product.name;

          let pcategory = product.category;

          let pquantity = product.quantity;

          let pprice = product.price;

          let pdescription = product.description;

          let plikedby = product.likedBy;

          client.get(like, (err, obj) => {

            if (err) return res.render("search", { error: err });

            else {

              res.render("viewproducts", {

                pid: id,

                pname: pname,

                pcategory: pcategory,

                pquantity: pquantity,

                pprice: pprice,

                pdescription: pdescription,

                plikedby: plikedby,

                likes: obj,
              });
            }
          });
        }
      });
    } catch (err) {

      if (err) console.log(err);

    }
  } else {

    return res.render("search", { error: validate.error.message });

  }
});

/**
 * TODO WILL BE REMOVED IN PRODUCTION
 * End point for Search product directly without submit data. Developer purpose only
 */

router.get("/:name", auth, async (req, res) => {

  try {

    const verifyProductData = {

      name: req.params.name

    };

    //Get the products form DB using product class
    const searchProduct = await searchData(verifyProductData);

    if (!searchProduct) return res.render("search", { error: "Product is not available" });

    // Data should fill in viewproducts handlebars
    let product = searchProduct;

    let _id = product._id;

    let like = _id.toString();

    let pname = product.name;

    let pcategory = product.category;

    let pquantity = product.quantity;

    let pprice = product.price;

    let pdescription = product.description;

    let plikedby = product.likedBy;

    //fill in viewproducts handlebars
    client.get(like, (err, obj) => {

      if (err) console.log(err);

      else {

        res.render("viewproducts", {

          pid: _id,

          pname: pname,

          pcategory: pcategory,

          pquantity: pquantity,

          pprice: pprice,

          pdescription: pdescription,

          plikedby: plikedby,

          likes: obj,

        });
      }
    });
  } catch (err) {

    res.json(err);

  }
});

/**
 * TODO LIST THE PRODUCTS IN DASHBOARD SHOULD BE MODIFY IN FURTHER UPDATES
 * End point for list the all products in dashabord, view engine user interface call
 * @async
 * @returns All products in collection
 */

router.get("/", auth, async (req, res) => {

  try {

    const viewProducts = await productInstance.products();

    if (!viewProducts) return res.status(400).render("listview", { error: "Sorry... No product is available...!" });

    res.render("listview", {

      products: viewProducts,

    });

    // TODO ADD ITERATION FOR LIST PRODUCTS WITH LIKES WHICH IS LOCATED ON BACKUP.JS
  } catch (err) {

    if (err) {

      console.log(err);

      res.json({ message: err });

    }
  }
});

/**
 * End point for edit products user interface
 * @async
 */

router.get("/edit/:id", async (req, res) => {

  const id = req.params.id;

  await productInstance.searchProductById(id, (err, result) => {

    if (err) throw err;

    let product = result[0][0];

    //Data to be filled in textboxes
    let pname = product.name;

    let category = product.category;

    let price = product.price;

    let quantity = product.quantity;

    let description = product.description;

    res.render("editproducts", {

      pid: id,

      pname: pname,

      category: category,

      price: price,

      quantity: quantity,

      description: description,

    });
  });
});

/**
 * End point for edit the product and store it again in Products collection
 * @async
 * @returns {Promise} updated product
 */

router.patch("/edit/:id", auth, async (req, res) => {

  //Validate product
  const validate = Product.edit(req.body);

  if (validate.error == null) {

    try {

      const id = req.params.id;

      const productData = {

        id: id,

        name: req.body.name,

        category: req.body.category,

        price: req.body.price,

        quantity: req.body.quantity,

        description: req.body.description

      };

      await productInstance.editProduct(productData, (err, result) => {

        if (err) throw err;

        res.render("editproducts", { success: "Modified successfully." });

      });

    } catch (err) {

      if (err) {

        console.log(err);

        res.json(err);

      }
    }
  } else {

    console.log(validate.error.message);

    res.status(400).render("editproducts", { error: validate.error.message });

  }
});

/**
 * End point for update likes by each click on userinterface
 * @async
 * @returns Like for purticular product on redis database
 */

router.patch("/like/:id", auth, async (req, res) => {

  try {

    const id = req.params.id;

    await productInstance.searchProductById(id, (err, result) => {

      if (err) throw err;

      if (result[0].length < 1) {

        return res.status(400).render("search", { error: "Invalid product" });

      } else {

        let emailData = {

          email: req.user.email,

          id: req.params.id

        };

        productInstance.searchProductByEmail(emailData, (err, result) => {

          if (err) throw err;

          if (result[0].length > 0) {

            return res.status(400).render("viewproducts", { error: "You are already liked" });

          } else {

            const likes = client.incrby(id, 1, (err, reply) => {

              if (err) throw err;

            });

            if (likes) {

              productInstance.updateLikes(emailData, (err, result) => {

                if (err) throw err;

                res.status(200).render("viewproducts", {

                  success: "You are liked this products"

                });

              });

            } else {

              console.log("some error occured");

            }
          }
        });
      }
    });

  } catch (err) {

    if (err) {

      res.status(400).render("viewproducts", { error: err });

    }
  }
});

/**
 * End point for delete the product in Products collection
 * @async
 * @returns {Promise} Deleted the product
 */

router.delete("/:_id", auth, async (req, res) => {

  try {

    const id = req.params._id;

    const like = String(id);

    let searchQuery = `CALL search_prod_by_id_proc( '${id}' )`;

    await productInstance.searchProductById(id, (err, result) => {

      if (err) throw err;

      if (result[0].length < 1) {

        return res.status(400).render("search", { error: "Invalid product" });

      } else {

        client.del(like);

        productInstance.deleteProduct(id, (err, result) => {

          if (err) throw err;

          res.render("search", { success: "deleted successfully" });

        });
      }
    });

  } catch (err) {

    if (err) {

      res.status(400).render("viewproducts", { error: err });

    }
  }
});

module.exports = router;
