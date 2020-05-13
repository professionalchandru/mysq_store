const { con }                           = require("../db_config");

const router                            = require("express").Router();

const bcrypt                            = require("bcryptjs");

const jwt                               = require("jsonwebtoken");

//Import user model
const { userModelInstance }             = require("../models/usermodel");

const userInstance                      = userModelInstance();

//Import Joi Validation
const { User }                          = require("../validation");

/**
 * Register user view engine user interface call
 * @async
 */
router.get("/register", async (req, res, next) => {

  res.render("register");

});

/**
 * create new user for access our application
 * @async
 * @returns {object} created user
 * @param {object} userDetails name, email, password
 */
router.post("/register", async (req, res) => {

  //Validation applied here
  const validate = User.register(req.body);

  if (validate.error == null) {

    try {

      //Generate hash password
      const salt = await bcrypt.genSalt(12);

      const hashPassword = await bcrypt.hash(req.body.password, salt);

      const userData = {

        name: req.body.name,

        email: req.body.email,

        password: hashPassword

      };

      let email = req.body.email;

      //Check existing user

      await userInstance.searchUser(userData, (err, result) => {

        if (err) throw err;

        if (result[0].length > 0) {

          return res.status(400).render("register", {

            error: req.body.email + " is already exist"

          });

        } else {

          userInstance.createUser(userData, (err, result) => {

            if (err) throw err;

            res.status(200).render("register", {

              success: userData.email + " is added sucessfully",

            });
          });
        }
      });

    } catch (err) {

      if (err) {

        res.status(400).render("register", { error: err });

      }
    }
  } else {

    res.status(400).render("register", { error: validate.error.message });

  }
});

/**
 * Login in to our app
 * @returns jwt token for authorised user
 * @param {object} userDetails
 * @async
 */
router.post("/login", async (req, res) => {

  //Joi validation for user inputs
  const validate = User.login(req.body);

  if (validate.error == null) {

    try {

      const userEmail = {

        email: req.body.email

      };

      await userInstance.searchUser(userEmail, async (err, result) => {

        if (err) throw err;

        if (result[0].length < 1) {

          return res.status(400).render("login", { error: req.body.email + " doesn't exist" });

        }

        const userData = {

          id: result[0][0].id,

          email: result[0][0].email,

          existingPassword: result[0][0].password,

          password: req.body.password

        };

        //Verify password
        let passchekc = await userInstance.verifyUser(userData);

        if (!passchekc) {

          return res.render("login", { error: "Invalid Password" });

        } else {

          let token = await userInstance.tokenGenerator(userData);

          res.cookie("token", token, { maxAge: 3600 * 1000 });

          res.redirect("/api/products/search");

          res.end();

        }
      });

    } catch (err) {

      if (err) throw err;

    }
  } else {

    console.log(validate.error.message);

    res.status(400).render("login", { error: validate.error.message });

  }
});

module.exports = router;
