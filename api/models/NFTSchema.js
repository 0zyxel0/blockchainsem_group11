const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NFTSchema = new Schema(
    {
        user: { type: "String"},
        nftval: { type: Schema.Types.Mixed },

    }, { timestamps: true },
    { collection: "ntfs" }
);

module.exports = mongoose.model("ntfs", NFTSchema);