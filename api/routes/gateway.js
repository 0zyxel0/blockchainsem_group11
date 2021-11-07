// Initalize Libraries
require("dotenv").config();
const { Router } = require("express");
// Create Instance
const router = new Router();
// Initialize Controller Files
const apiController = require("./../controllers/apiController");

// Export modules
module.exports = router;