const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const metaComments = new Schema({
    by: { type: String },
    comment: { type: String },
    timestamp: { type: Date, default: new Date() }
});

const NFTMetaSchema = new Schema(
    {
        nftid: { type: String, required: true },
        tokenid: { type: Number, default: 0 },
        title: { type: String, default: "no title" },
        description: { type: String, default: "no description" },
        filename: { type: String, required: true },
        nftUri: { type: String },
        likes: { type: Number, default: 0 },
        likedBy: [],
        comments: metaComments
    },
    { timestamps: true },
    { collection: "ntf_metas" }
);
module.exports = mongoose.model("ntf_metas", NFTMetaSchema);
