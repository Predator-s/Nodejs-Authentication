const express = require("express");
const routers = express.Router();

// user routes
routers.use("/users", require("./users"));
routers.use("/", require("./users"));

module.exports = routers;
