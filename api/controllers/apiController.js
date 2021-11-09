// Import Schemas
const NFTSchema = require("../models/NFTSchema");
const UserSchema = require("../models/UserSchema");
import {nanoid} from "nanoid";
const logger = require("../logger");
const { formResponse } = require("../helpers/formResponse");
module.exports.test = function (req, res) {
    return res.status(200).json("hello world");
};
module.exports.saveUnmintedItem = async function (req, res) {
    try {

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
        let myResult = await UserSchema.findOne({ "walletAddr": req.body.walletAddr });
        if (myResult) {
            logger.info(`User Found: ${myResult.walletAddr}`);
            return res.status(200).json(formResponse("success", myResult, null));
        } else {
            let myUser = new UserSchema({
                walletAddr: req.body.walletAddr,
                nonce: nanoid(25),
            });
            myUser.save().then(response => {
                console.log(`Created User Record`);
                return res.status(200).json(formResponse("success", response, null));
            })

        }
    } catch (err) {
        console.log(err);
        return res.status(400).json(formResponse("error", null, err));
    }
};



