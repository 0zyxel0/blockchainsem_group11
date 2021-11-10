import { nanoid } from "nanoid";
const jwt = require("jsonwebtoken");
import { ethers } from 'ethers';
const Joi = require("joi");
const axios = require("axios");
// Import Schemas
const NFTSchema = require("../models/NFTSchema");
const UserSchema = require("../models/UserSchema");
const logger = require("../logger");
const { formResponse } = require("../helpers/formResponse");

module.exports.test = function (req, res) {
  return res.status(200).json("hello world");
};

module.exports.saveUnmintedItem = async function (req, res) {
  try {
    // logger.info(`Saving Unminted Item For User : ${req.user.walletAddr}`);
    let myNFT = new NFTSchema({
      owner: req.user,
      nftval: req.body.value,
      nftUri: `ipfs://${req.body.value.cid}`,
      amount: 50,
    });

    let myResult = await myNFT.save();
    if (myResult) {
      logger.info("[saveUnmintedItem] Saving Unminted Item");
      console.log(myResult);
    }

    return res.status(200).json(req.body);
  } catch (err) {
    return res.status(400).json(formResponse("error", null, err));
  }
};

module.exports.getItemMetadata = async function (req, res) {
  try {
  } catch (err) {
    return res.status(400).json(formResponse("error", null, err));
  }
};
module.exports.getUserUnmintedItems = async function (req, res) {
  try {
  } catch (err) {
    return res.status(400).json(formResponse("error", null, err));
  }
};
/**
 * deleteUserUnmintedItems is a function that will update the record of the the NFT if it is minted or not. This will just return the object itself
 * if the nft is not minted else it will return nothing. 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports.deleteUserUnmintedItems = async function (req, res) {
  try {
  } catch (err) {
    return res.status(400).json(formResponse("error", null, err));
  }
};

module.exports.login = async function (req, res) {
  try {
    let walletAddr = req.body.walletAddr;
  } catch (err) {
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
