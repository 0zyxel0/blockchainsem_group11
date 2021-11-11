// Initalize Libraries
require("dotenv").config();
const { Router } = require("express");
const { checkToken } = require("../middleware/checkToken");
// Create Instance
const router = new Router();
// Initialize Controller Files
const apiController = require("../controllers/apiController");
router.get("/v1/user/unminted", checkToken, apiController.getUserUnmintedItems);
router.get("/v1/item/detail", checkToken, apiController.getItemMetadata);
router.post("/v1/item/save", checkToken, apiController.saveUnmintedItem);
router.put("/v1/user/changename", checkToken, apiController.updateDisplayName);
// Authentication Routes
router.post("/v1/auth/nonce", apiController.createUserNonce);
router.post("/v1/auth/verification", apiController.verifyAuthentication);
// Export modules
module.exports = router;
