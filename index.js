const express                          = require('express');

const mysql                            = require('mysql');

const methodOverride                   = require('method-override');

const exphbs                           = require('express-handlebars');

const bodyParser                       = require('body-parser');

const dotenv                           = require('dotenv').config();

const redis                            = require('redis');

const path                             = require('path');

const cookieParser                     = require('cookie-parser');

const port                             = process.env.PORT || 3000;

const client                           = redis.createClient();

const app                              = express();

/**
 * MySQL connection
 */
const {con}                            = require('./db_config')

/**
 * redis server connection on
 * @returns connection status
 */
client.on('connect', () => console.log('redis server is up...'));

/**
 * View engine initialization
 */
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

app.set('view engine', 'handlebars');

/**
 * middlewares needed by this app
 */
app.use(express.json());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

/**
 * method override fuction to override http methods
 */
app.use(methodOverride('_method'));

/**
 * different routes used in our app
 */
const userRoute                         = require('./routes/user');

const productRoute                      = require('./routes/products');

/**
 * Route middlewares access routes
 */
app.use('/api/users', userRoute);

app.use('/api/products', productRoute);

/**
 * Login view engine userinterface call
 */
app.get('/', (req, res, next) => {

  res.render('login')

});

/**
 * Server connection for our app
 */
app.listen(port, () => console.log('Server is up and listening in port ' + port));
