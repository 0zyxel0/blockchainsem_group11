const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const metaSchema = new Schema({
  title: { type: String, default: "no title" },
  description: { type: String, default: "no description" },
  price: { type: Number, default: 0 },
  amount: { type: Number, default: 1 },

});

const NFTSchema = new Schema(
  {
    owner: { type: "String", required: true },
    nftval: {},
    nftUri: { type: String },
    filename: {type: String,required: true},
    meta: metaSchema,
    isMinted: { type: Boolean, default: false },
    isMarket: { type: Boolean, default: false }
  },
  { timestamps: true },
  { collection: "ntfs" }
);

module.exports = mongoose.model("ntfs", NFTSchema);
