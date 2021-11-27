const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NFTMetaSchema = new Schema(
    {
        nftid: {type: String, required: true},
        tokenid: { type: Number, default: 0 },
        title: { type: String, default: "no title" },
        description: { type: String, default: "no description" },
        filename: { type: String, required: true },
        nftUri: { type: String },
    },
    { timestamps: true },
    { collection: "ntf_metas" }
);
module.exports = mongoose.model("ntf_metas", NFTMetaSchema);