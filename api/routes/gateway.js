// Initalize Libraries
require("dotenv").config();
const { Router } = require("express");
const { checkToken } = require("../middleware/checkToken");
// Create Instance
const router = new Router();
// Initialize Controller Files
const apiController = require("../controllers/apiController");
router.get("/v1/user/minted/recent", checkToken, apiController.getRecentUserMintedItems);
router.get("/v1/user/minted", checkToken, apiController.getUserMintedItems);
router.get("/v1/user/unminted/recent", checkToken, apiController.getUserRecentUnmintedItems);
router.get("/v1/user/unminted", checkToken, apiController.getUserUnmintedItems);
router.put("/v1/user/changename", checkToken, apiController.updateDisplayName);
router.post("/v1/item/detail", checkToken, apiController.getItemMetadata);
router.post("/v1/item/save", checkToken, apiController.saveUnmintedItem);
router.post("/v1/item/pinata/save", checkToken, apiController.saveUnmintedItemPinata);
router.post("/v1/items/getItems", checkToken, apiController.getNFTByTokenId);
router.put("/v1/item/mint", checkToken, apiController.mintingAssets);
router.post("/v1/nft/meta", checkToken, apiController.getNFTTokenDetails);
// Authentication Routes
router.post("/v1/auth/nonce", apiController.createUserNonce);
router.post("/v1/auth/verification", apiController.verifyAuthentication);

router.post("/v1/item/like", checkToken, apiController.saveLikeNFTItem);
router.post("/v1/item/dislike", checkToken, apiController.saveDislikeNFTItem);
router.post("/v1/item/comment", checkToken, apiController.saveNFTComments);
router.post("/v1/user/theme", checkToken, apiController.updateUserTheme);
// Export modules
module.exports = router;
