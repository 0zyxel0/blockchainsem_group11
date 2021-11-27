const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemLiked = new Schema({
    tokenid: { type: String },
});

const UserSchema = new Schema(
    {
        walletAddr: { type: "String", required: true },
        displayName: { type: "String", default: null },
        displayImg: { type: "String", default: null },
        isDark: { type: "Boolean", default: false },
        unmintedNft: { type: "Number", default: 0 },
        ownedNft: { type: "Number", default: 0 },
        nonce: { type: "String", default: null },
        likedNFT: [itemLiked],
    }, { timestamps: true },
    { collection: "users" }
);

module.exports = mongoose.model("users", UserSchema);