const cors = require("cors");
const exp = require("express");
const passport = require("passport");
const { connect } = require("mongoose");
const { success, error } = require("consola");
const path = require('path');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var moment = require('moment')

const {
  createOrder,
  capturePayment
} = require('./paypal.js');


// Bring in the app constants
const { ATLAS_URL, PORT } = require("./config");

// Initialize the application
const app = exp();

// create order
app.post("/api/orders", async (req, res) => {
  const order = await createOrder();
  res.json(order);
});

// capture payment
app.post("/api/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  const captureData = await capturePayment(orderID);
  res.json(captureData);
});


// Middlewares
app.use(cors());
// app.use(bp.json());
app.use(exp.json());
app.use(exp.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser('secret'));


app.use(session({
  secret: 'secret', 
  cookie: { maxAge: 10000 * 90000 * 365 },
  resave: true, 
  saveUninitialized: true,
  loggedIn: false
}));

// using flash
app.use(flash());

// accessing session globally
app.use(function(req, res, next) {
  var shortDateFormat = "ddd @ h:mmA"; 
  res.locals.moment = moment; // this makes moment available as a variable in every EJS page
  res.locals.shortDateFormat = shortDateFormat;
  next();
});

// User Router Middleware
app.use("/", require("./routes/router"));

require("./middlewares/passport")(passport);

// set view engine
app.set("view engine", "ejs");
// app.set("views", path.resolve(__dirname, "views"));

// load assets
app.use('/uploads', exp.static(path.resolve(__dirname, "uploads")));
app.use('/css', exp.static(path.resolve(__dirname, "assets/css")))
app.use('/images', exp.static(path.resolve(__dirname, "assets/images")))
app.use('/js', exp.static(path.resolve(__dirname, "assets/js")))


const startApp = async () => {
  try {

    // Connection With DB
    await connect(ATLAS_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    success({
      message: `Successfully connected with the Database \n${ATLAS_URL}`,
      badge: true
    });

    // Start Listenting for the server on PORT
    app.listen(process.env.PORT || 5000, () =>
      success({ message: `Server started on PORT ${process.env.PORT}`, badge: true })
    );
  } catch (err) {
    error({
      message: `Unable to connect with Database \n${err}`,
      badge: true
    });
    startApp();
  }
};

startApp();