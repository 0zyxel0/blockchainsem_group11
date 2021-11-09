// Initalize Libraries
require("dotenv").config();
const { Router } = require("express");
// Create Instance
const router = new Router();
// Initialize Controller Files
const apiController = require("../controllers/apiController");

router.get("/v1/test", apiController.test);
router.get("/v1/user/unminted", apiController.getUserUnmintedItems);
router.get("/v1/item/detail", apiController.getItemMetadata);
router.post("/v1/item/save", apiController.saveUnmintedItem);
router.post("/v1/auth/nonce", apiController.createUserNonce);
router.post("/v1/auth/verification", apiController.verifyAuthentication);
// Export modules
module.exports = router;
