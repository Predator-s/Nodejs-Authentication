const User = require("../models/user");

// display profile
module.exports.profile = function (req, res) {
  return res.render("user_profile", {
    title: "User Profile",
    profile_user: req.user,
  });
};

// update user Details
module.exports.updateUser = async function (req, res) {
  try {
    const user = await User.findById(req.user.id);
    const { username, password, confirm_password } = req.body;

    if (password != confirm_password) {
      req.flash("error", "Password confirmPassword should match!");
      return res.redirect("/");
    }

    if (!user) {
      return res.redirect("back");
    }

    user.name = username;
    user.password = password;

    user.save();
    return res.redirect("back");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

// render the Sign In page
module.exports.signIn = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  return res.render("signin.ejs");
};

// render the Sign Up page
module.exports.signUp = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  return res.render("signup.ejs");
};

// creating up a new user
module.exports.create = async (req, res) => {
  try {
    const { username, email, password, confirm_password } = req.body;

    // if password doesn't match
    if (password != confirm_password) {
      req.flash("error", "Password & confirmPassword should match!");
      return res.redirect("/sign-up");
    }

    // check if user already exist
    User.findOne({ email }, async (err, user) => {
      if (err) {
        console.log("Error in finding user in signing up");
        req.flash("error", err);
        return res.redirect("/sign-up");
      }

      if (!user) {
        await User.create(
          {
            email,
            password,
            name: username,
          },
          (err, user) => {
            if (err) {
              console.log("error", err);
              req.flash("error", "Couldn't sign Up");
              return res.redirect("/sign-up");
            }
            req.flash("success!", "Registered Successfully!");
            return res.redirect("/");
          }
        );
      } else {
        console.log("error", "Email already registed!");
        req.flash("error", "Email already registed!");
        return res.redirect("/sign-up");
      }
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong!");
    return res.redirect("/sign-up");
  }
};

// sign in and create a session for the user
module.exports.createSession = (req, res) => {
  req.flash("success", "Logged In Successfully!");
  return res.redirect("/dashboard");
};

// clears the cookie
module.exports.destroySession = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "you have logged out!");
  return res.redirect("/");
};
