module.exports.dashboard = async function (req, res) {
  try {
    if (req.isAuthenticated()) {
      return res.render("dashboard");
    } else {
      return res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};
