const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 8000;
const db = require("./config/mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport");

const MongoStore = require("connect-mongo");

const cors = require("cors");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const flash = require("connect-flash");
const customWnare = require("./config/middleware");
app.use(
  cors({
    origin: "*",
  })
);

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(cookieParser());

// set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// mongo-store is used to store session cookies in database
app.use(
  session({
    name: "Auth-Assignment",
    secret: "asewe",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl:
      "mongodb+srv://prashant:prashant@cluster0.q8vhtxi.mongodb.net/?retryWrites=true&w=majority",
      autoRemove: "disabled",
    }),
    function(err) {
      console.log(err || "connect-mongodb setup ok");
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// sets the authenticated user in the response
app.use(passport.setAuthenticatedUser);

// For Flash messages
app.use(flash());
app.use(customWnare.setFlash);

// using express routers
app.use(require("./routes"));

// listening to the port 8000;
app.listen(port, (err) => {
  if (err) {
    console.log("error in starting the server", err);
    return;
  }
  console.log("server is succesfully running on port 8000");
});
