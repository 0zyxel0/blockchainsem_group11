const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NFTSchema = new Schema(
  {
    owner: { type: "String", required: true },
    nftval: {},
    nftUri: { type: "String" },
    amount: { type: Number, default: 0 },
    meta: {},
    isMinted: { type: Boolean, default: false },
  },
  { timestamps: true },
  { collection: "ntfs" }
);

module.exports = mongoose.model("ntfs", NFTSchema);
