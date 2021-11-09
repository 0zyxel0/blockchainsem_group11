const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        walletAddr: { type: "String", required: true },
        displayName: { type: "String", default: null},
        displayImg: { type: "String", default: null },
        nonce:{ type: "String", default: null},        
    }, { timestamps: true },
    { collection: "users" }
);

module.exports = mongoose.model("users", UserSchema);