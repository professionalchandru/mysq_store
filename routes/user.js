const {con}                             = require('../db_config');

const router                            = require('express').Router();

const bcrypt                            = require('bcryptjs');

const jwt                               = require('jsonwebtoken')

//Import user model
const { userModelInstance } = require('../models/usermodel');

//Import Joi Validation
const { User } = require('../validation');

/**
 * Register user view engine user interface call
 * @async
 */
router.get('/register', async (req, res, next) => {

  res.render('register');

})

/**
 * create new user for access our application
 * @async
 * @returns {object} created user
 * @param {object} userDetails name, email, password
 */
router.post('/register', async (req, res) => {

  //Validation applied here
  const validate = User.register(req.body);

  if (validate.error == null) {

    try {

      //Generate hash password
      const salt = await bcrypt.genSalt(12)

      const hashPassword = await bcrypt.hash(req.body.password, salt)

      const userData = {

        name: req.body.name,

        email: req.body.email,

        password: hashPassword

      };

      //Check existing user
      let sql = `SELECT email FROM users where email = '${req.body.email}'`

      const userExist = await con.query(sql,(err,result)=>{

        if(err) throw err

        if(result.length>0)
        {

          return res.status(400).render('register', { error: req.body.email + ' is already exist' });

        }

        else{

          const newUser = userInstance.createUser(userData);

          res.status(200).render('register', { success: userData.email + ' is added sucessfully' })
        }
      })


    } catch (err) {

      if (err) {

        res.status(400).render('register', { error: err })

      }
    }

  } else {

    res.status(400).render('register', { error: validate.error.message });

  }
});

/**
 * Login in to our app
 * @returns jwt token for authorised user
 * @param {object} userDetails
 * @async
 */
router.post('/login', async (req, res) => {

  //Joi validation for user inputs
  const validate = User.login(req.body);

  if (validate.error == null) {

  //Check existing user
  let sql = `SELECT * FROM users where email = '${req.body.email}'`

  const user = await con.query(sql,async(err,result)=>{

    if(err) throw err

    if(result.length<1)
    {

      return res.status(400).render('login', { error: req.body.email + " doesn't exist" });

    }

    const userData ={

      id: result[0].id,

      email: result[0].email,

      existingPassword : result[0].password,

      password : req.body.password

    }

    //Verify password
    const passCheck = await bcrypt.compare(userData.password, userData.existingPassword)

    console.log(passCheck)

    if (!passCheck) {

      return res.render('login', { error: "Invalid Password" });

    }else{

    const token = await jwt.sign({ id: userData.id, email: userData.email }, process.env.TOKEN_SECRET, { expiresIn: '5h' });

    res.cookie('token', token, { maxAge: 3600 * 1000 });

    res.redirect('/api/products/search');

    res.end()

    }

  })

  } else {

    console.log(validate.error.message)

    res.status(400).render('login', { error: validate.error.message });

  }

});

module.exports = router;
