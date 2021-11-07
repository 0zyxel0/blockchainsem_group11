require("dotenv").config();
const express = require("express");
const db = require("./config/db");
const cors = require("cors");
// Create express instance
const app = express();
// Initialize json bosy options body-parser library
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Require route API
const gatewayEndpoint = require("./routes/gateway");
// CALL MIDDLEWARES
app.use(cors());
// ENABLE API ROUTES
app.use(gatewayEndpoint);
// Export Modules
module.exports = {
  path: "/api",
  handler: app
};
