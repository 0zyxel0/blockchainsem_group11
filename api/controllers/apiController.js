import { nanoid } from "nanoid";
import { ethers } from 'ethers';
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const axios = require("axios");
// Import Schemas
const NFTSchema = require("../models/NFTSchema");
const UserSchema = require("../models/UserSchema");
const NFTMetaSchema = require("../models/NFTMetaSchema");
const logger = require("../logger");
const { formResponse } = require("../helpers/formResponse");

module.exports.saveUnmintedItem = async function (req, res) {
  logger.info(`[saveUnmintedItem] Saving Unminted Item`)
  // Create Validation Schema
  const mintValidationSchema = Joi.object({
    owner: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
  });

  const isValidated = mintValidationSchema.validate({
    owner: req.user.sub.walletAddr,
    title: req.body.title,
    description: req.body.description,
  });

  // Throw validation error
  if (isValidated.error != null) {
    logger.error(
      `[saveUnmintedItem] ${JSON.stringify(isValidated.error.details)}`
    );
    return res
      .status(400)
      .json(formResponse("fail", null, isValidated.error.details));
  }
  try {
    // logger.info(`Saving Unminted Item For User : ${req.user.walletAddr}`);
    let myNFT = new NFTSchema({
      owner: isValidated.value.owner,
      nftval: req.body.ipfsVal.value,
      nftUri: `https://${req.body.ipfsVal.value.cid}.ipfs.dweb.link/${req.body.filename}`,
      filename: req.body.filename,
      meta: {
        title: isValidated.value.title,
        description: isValidated.value.description,
      },
      isMinted: false,
      isMarket: false
    });

    let myResult = await myNFT.save();

    if (myResult) {
      logger.info("[saveUnmintedItem] Successfully Uploaded Item");
      let ipfsResult = {
        id: myResult._id,
        owner: myResult.owner,
        nftUri: myResult.nftUri,
        meta: myResult.meta,
        isMinted: myResult.isMinted,
        isMarket: myResult.isMarket,
        createdAt: myResult.createdAt
      };

      let myNFTMeta = new NFTMetaSchema({
        nftid: myResult._id,
        title: isValidated.value.title,
        description: isValidated.value.description,
        filename: req.body.filename,
        nftUri: `https://${req.body.ipfsVal.value.cid}.ipfs.dweb.link/${req.body.filename}`,
      });

      let myMetaResult = await myNFTMeta.save();

      return res.status(201).json(formResponse("success", ipfsResult, null));
    }
  } catch (err) {
    logger.error(err);
    return res.status(400).json(formResponse("error", null, err));
  }
};

module.exports.getItemMetadata = async function (req, res) {
  try {
    logger.info("[getItemMetadata] Requesting NFT Details");
    // Create Validation Schema
    const mintValidationSchema = Joi.object({
      owner: Joi.string().required(),
      nftid: Joi.string().required(),
    });

    const isValidated = mintValidationSchema.validate({
      owner: req.user.sub.walletAddr,
      nftid: req.body.nftid
    });

    // Throw validation error
    if (isValidated.error != null) {
      logger.error(
        `[getItemMetadata] ${JSON.stringify(isValidated.error.details)}`
      );
      return res
        .status(400)
        .json(formResponse("fail", null, isValidated.error.details));
    }

    let filterVal = {
      owner: isValidated.value.owner,
      _id: isValidated.value.nftid
    };
    let myResult = await NFTSchema.findOne(filterVal);
    if (myResult) {
      logger.info("[getItemMetadata] Successfully Retrieved Item Details");
      return res.status(200).json(formResponse("success", myResult, null));
    }
    if (!myResult) {
      logger.info("[getItemMetadata] Failure to retrieve Item Details");
      return res.status(404).json(formResponse("error", null, "Item Details Not Found"))
    }
  } catch (err) {
    return res.status(400).json(formResponse("error", null, err));
  }
};


module.exports.getUserRecentUnmintedItems = async function (req, res) {
  try {
    logger.info(`[getUserRecentUnmintedItems] Requesting User Unminted Items`);

    let myResult = await NFTSchema.find({ owner: req.user.sub.walletAddr, isMinted: false }).sort({ 'date': -1 }).limit(5).exec();
    if (myResult.length > 0) {
      logger.info("[getUserRecentUnmintedItems] Successfully retrieved User Recent Unminted Items");
      return res.status(200).json(formResponse('success', myResult, null));
    } else {
      logger.warn("[getUserRecentUnmintedItems] Retrieved 0 Unminted Items");
      return res.status(200).json(formResponse('success', [], null));
    }

  } catch (err) {
    return res.status(401).json(formResponse("error", null, err));
  }
};


module.exports.getUserUnmintedItems = async function (req, res) {
  try {
    logger.info(`[getUserUnmintedItems] Requesting User Unminted Items`);

    let myResult = await NFTSchema.find({ owner: req.user.sub.walletAddr, isMinted: false });
    if (myResult.length > 0) {
      logger.info("[getUserUnmintedItems] Successfully retrieved User Unminted Items");
      return res.status(200).json(formResponse('success', myResult, null));
    } else {
      logger.warn("[getUserUnmintedItems] Retrieved 0 Unminted Items");
      return res.status(200).json(formResponse('success', [], null));
    }

  } catch (err) {
    return res.status(401).json(formResponse("error", null, err));
  }
};
/**
 * deleteUserUnmintedItems is a function that will update the record of the the NFT if it is minted or not. This will just return the object itself
 * if the nft is not minted else it will return nothing. 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports.mintingAssets = async function (req, res) {
  try {
    logger.info(`[mintingAssets] Updating Unmited User Status`);
    console.log(req.body);
    // Create Validation Schema
    const mintValidationSchema = Joi.object({
      owner: Joi.string().required(),
      nftid: Joi.string().required(),
      tokenid: Joi.number().required()
    });

    const isValidated = mintValidationSchema.validate({
      owner: req.user.sub.walletAddr,
      nftid: req.body.nftid,
      tokenid: req.body.tokenid
    });

    // Throw validation error
    if (isValidated.error != null) {
      logger.error(
        `[mintingAssets] ${JSON.stringify(isValidated.error.details)}`
      );
      return res
        .status(400)
        .json(formResponse("fail", null, isValidated.error.details));
    }

    let filterVal = { owner: isValidated.value.owner, _id: isValidated.value.nftid, isMinted: false };
    let updateVal = { isMinted: true, tokenid: isValidated.value.tokenid };
    let configVal = { new: true };

    let myResult = await NFTSchema.findOneAndUpdate(filterVal, updateVal, configVal);
    if (myResult) {
      let metaFilter = { nftid: isValidated.value.nftid };
      let metaUpdate = { tokenid: isValidated.value.tokenid };
      let metaConfig = { new: true };
      let myResultDetails = await NFTMetaSchema.findOneAndUpdate(metaFilter, metaUpdate, metaConfig);
      console.log(myResultDetails);
      logger.info(`[mintingAssets] Successfully updated Unminted User Asset`);
      return res.status(200).json(formResponse("success", myResult, null));
    }

  } catch (err) {
    logger.error("[mintingAssets] Error in Updating Unminted Asset Record");
    return res.status(400).json(formResponse("error", null, err));
  }
};


module.exports.createUserNonce = async function (req, res) {
  try {
    // Find User Record
    let myResult = await UserSchema.findOne({
      walletAddr: req.body.walletAddr,
    });
    if (myResult) {
      logger.info(`[createUserNonce] User Found: ${myResult.walletAddr}`);
      // Update and Give Back a New One Time Nonce
      let filterVal = { walletAddr: myResult.walletAddr };
      let updateVal = { nonce: nanoid(25) };
      let configVal = { new: true };
      logger.info(`[createUserNonce] Updating User One Time Nonce`);
      let myUser = await UserSchema.findOneAndUpdate(filterVal, updateVal, configVal);
      if (myUser) {
        logger.info(
          `[createUserNonce] Successfully Updated User Record. Returning New Nonce`
        );
        return res
          .status(200)
          .json(formResponse("success", { nonce: myUser.nonce }, null));
      }
    } else {
      // Generate A Random User Display Image
      let avatarHash = nanoid(4);
      let myUser = new UserSchema({
        walletAddr: req.body.walletAddr,
        displayImg: `https://avatars.dicebear.com/api/adventurer-neutral/${avatarHash}.svg`,
        nonce: nanoid(25),
      });
      let curUser = await myUser.save();
      if (curUser) {
        logger.info(`[createUserNonce] Created New User Record`);
        return res.status(200).json(formResponse("success", curUser, null));
      }
    }
  } catch (err) {
    logger.error(err);
    return res.status(400).json(formResponse("error", null, err));
  }
};

module.exports.verifyAuthentication = async (req, res) => {
  try {
    // Verify User Authentication
    let walletAddr = req.body.walletAddr;
    let userNonce = req.body.userNonce;
    let userSignature = req.body.userSignature;
    // Verify The Nonce and Signature of the user for authentication
    let verifiedSigner = ethers.utils.verifyMessage(userNonce, userSignature);
    if (verifiedSigner !== walletAddr) {
      logger.warn("[verifyAuthentication] User Signature Mismatch")
      return res.status(409).json(formResponse("error", null, "Invalid User Signature"));
    }

    let filterVal = { walletAddr: walletAddr, nonce: userNonce };
    let myResult = await UserSchema.findOne(filterVal);
    if (!myResult) {
      return res.status(404).json(formResponse("error", null, "Error In User Authentication"));
    }
    if (myResult) {
      // Update The One Time Nonce to a new value
      myResult.nonce = nanoid(25);
      await myResult.save();

      // Return JWT to user
      const userToken = jwt.sign({
        aud: "authenticated",
        exp: Math.floor((Date.now() / 1000) + (60 * 60)),
        sub: { id: myResult._id, walletAddr: walletAddr, displayName: myResult.displayName, displayImg: myResult.displayImg, isDark: myResult.isDark }
      }, process.env.JWT_TOKEN_SECRET);

      return res.status(200).json(formResponse("success", { token: userToken }, null));
    }


  } catch (err) {
    console.log(err);
    return res.status(400).json(formResponse("error", null, err));
  }
};

module.exports.updateDisplayName = async function (req, res) {
  try {
    const userValidationSchema = Joi.object({
      walletAddr: Joi.string().required(),
      displayName: Joi.string().required(),
    });

    const isValidated = userValidationSchema.validate({
      walletAddr: req.user.sub.walletAddr,
      displayName: req.body.displayName,
    });

    // Throw validation error
    if (isValidated.error != null) {
      logger.error(
        `[updateDisplayName] ${JSON.stringify(isValidated.error.details)}`
      );
      return res
        .status(400)
        .json(formResponse("fail", null, isValidated.error.details));
    }

    let filterVal = { walletAddr: isValidated.value.walletAddr };
    let updateVal = { displayName: isValidated.value.displayName };
    let configVal = { new: true };

    let myResult = await UserSchema.findOneAndUpdate(filterVal, updateVal, configVal);
    if (myResult) {
      logger.info("[updateDisplayName] Successfully Updated User Display Name");
      return res.status(201).json(formResponse('success', myResult, null));
    }
  } catch (err) {
    logger.error(err);
    return res.status(400).json(formResponse("error", null, err));
  }
};


module.exports.getRecentUserMintedItems = async function (req, res) {
  try {
    // Create Validation Schema
    const mintValidationSchema = Joi.object({
      owner: Joi.string().required()
    });

    const isValidated = mintValidationSchema.validate({
      owner: req.user.sub.walletAddr
    });

    // Throw validation error
    if (isValidated.error != null) {
      logger.error(
        `[getRecentUserMintedItems] ${JSON.stringify(isValidated.error.details)}`
      );
      return res
        .status(400)
        .json(formResponse("fail", null, isValidated.error.details));
    }

    logger.info(`[getRecentUserMintedItems] Requesting User Minted Items`);
    let myResult = await NFTSchema.find({ owner: isValidated.value.owner, isMinted: true }).sort({ 'date': -1 }).limit(5).exec();
    if (myResult.length > 0) {
      logger.info("[getRecentUserMintedItems] Successfully retrieved Minted Items");
      return res.status(200).json(formResponse("success", myResult, null));
    } else {
      logger.info("[getRecentUserMintedItems] User Has No Minted Items");
      return res.status(200).json(formResponse("success", [], null));
    }
  }
  catch (err) {
    logger.error("[getLimitedUserMintedItems] Error in Retreiving User Minted Assets");
    return res.status(400).json(formResponse("error", null, err));
  }
};

module.exports.getNFTByTokenId = async function (req, res) {
  try {
    let myResult = await NFTMetaSchema.find({ tokenid: { $in: req.body.tokenList } });
    if (myResult.length > 0) {
      logger.info("[getNFTByTokenId] Successfully retrieved NFT Items");
      return res.status(200).json(formResponse("success", myResult, null));
    } else {
      logger.info("[getNFTByTokenId] User Has Token Items");
      return res.status(200).json(formResponse("success", [], null));
    }
  } catch (err) {
    logger.error("[getNFTByTokenId] Error in Retreiving NFT Items");
    return res.status(400).json(formResponse("error", null, err));
  }
};

module.exports.getNFTTokenDetails = async function (req, res) {
  try {
    let myResult = await NFTMetaSchema.findOne({ tokenid: req.body.tokenid });
    if (myResult) {
      logger.info("[getNFTTokenDetails] Successfully retrieved NFT Metadata");
      return res.status(200).json(formResponse("success", myResult, null));
    }
  }
  catch (err) {
    logger.error("[getNFTTokenDetails] Error in Retreiving NFT Meta Data");
    return res.status(400).json(formResponse("error", null, err));
  }
};

module.exports.getUserMintedItems = async function (req, res) {
  try {
    // Create Validation Schema
    const mintValidationSchema = Joi.object({
      owner: Joi.string().required()
    });

    const isValidated = mintValidationSchema.validate({
      owner: req.user.sub.walletAddr
    });

    // Throw validation error
    if (isValidated.error != null) {
      logger.error(
        `[saveUnmintedItem] ${JSON.stringify(isValidated.error.details)}`
      );
      return res
        .status(400)
        .json(formResponse("fail", null, isValidated.error.details));
    }

    logger.info(`[getUserMintedItems] Requesting User Minted Items`);
    let myResult = await NFTSchema.find({ owner: isValidated.value.owner, isMinted: true });
    if (myResult.length > 0) {
      logger.info("[getUserUnmintedItems] Successfully retrieved Minted Items");
      return res.status(200).json(formResponse("success", myResult, null));
    } else {
      logger.info("[getUserUnmintedItems] User Has No Minted Items");
      return res.status(200).json(formResponse("success", [], null));
    }
  }
  catch (err) {
    logger.error("[getUserMintedItems] Error in Retreiving User Minted Assets");
    return res.status(400).json(formResponse("error", null, err));
  }
};

module.exports.saveLikeNFTItem = async function (req, res) {
  try {
    let filterVal = { tokenid: req.body.tokenid };
    let updateVal = { likedBy: req.user.sub.walletAddr, $inc: { likes: 1 } };
    let configVal = { new: true };
    let myResult = await NFTMetaSchema.findOneAndUpdate(filterVal, updateVal, configVal);
    if (myResult) {
      logger.info("[saveLikeNFTItem] Successfully Updated Likes");
      return res.status(201).json(formResponse("success", myResult, null));
    }
  } catch (err) {
    logger.error("[saveLikeNFTItem] Error in Updating NFT Asset Likes");
    return res.status(400).json(formResponse("error", null, err));
  }
};

module.exports.saveDislikeNFTItem = async function (req, res) {
  try {
    let filterVal = { tokenid: req.body.tokenid };
    let updateVal = { $pull: { likedBy: req.user.sub.walletAddr }, $inc: { likes: -1 } };
    let configVal = { new: true };
    let myResult = await NFTMetaSchema.findOneAndUpdate(filterVal, updateVal, configVal);
    if (myResult) {
      logger.info("[saveLikeNFTItem] Successfully Updated Likes");
      return res.status(201).json(formResponse("success", myResult, null));
    }
  } catch (err) {
    logger.error("[saveLikeNFTItem] Error in Updating NFT Asset Likes");
    return res.status(400).json(formResponse("error", null, err));
  }
};

module.exports.saveNFTComments = async function (req, res) {
  try {

    let filterVal = { tokenid: req.body.tokenid };
    let updateVal = { $push: { comments: { by: req.user.sub.walletAddr, comment: req.body.comment } } };
    let configVal = { new: true };
    let myResult = await NFTMetaSchema.findOneAndUpdate(filterVal, updateVal, configVal);
    if (myResult) {
      logger.info("[saveNFTComments] Successfully Updated Likes");
      return res.status(201).json(formResponse("success", myResult, null));
    }
  } catch (err) {
    logger.error("[saveNFTComments] Error in Addting Comment");
    return res.status(400).json(formResponse("error", null, err));
  }
};

module.exports.updateUserTheme = async function (req, res) {
  try {
    let filterVal = { walletAddr: req.user.sub.walletAddr };
    let updateVal = { isDark: req.body.isDark };
    let configVal = { new: true };
    let myResult = await UserSchema.findOneAndUpdate(filterVal, updateVal, configVal);
    if (myResult) {
      logger.info("[updateUserTheme] Successfully updated User Theme");
      return res.status(201).json(formResponse("success", myResult, null));
    }
  } catch (err) {
    logger.error("[updateUserTheme] Error in Updating User Theme");
    return res.status(400).json(formResponse("error", null, err));
  }
};
