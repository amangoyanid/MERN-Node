const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaceMaster = new Schema(
  {
    placeid: { type: Number },
    countryid: { type: Schema.Types.ObjectId },
    countryname: { type: String },
    stateid: { type: Schema.Types.ObjectId },
    statename: { type: String },
    placename: { type: String },
    status: { type: Number },
    category: { type: String },
    is_delete: { type: Number, default: 0 },

    createdbylogo: { type: String },
    createdby: { type: String },
    createdbyid: { type: String },
    updatedbylogo: { type: String },
    updatedbyid: { type: String },
    updatedby: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("placemaster", PlaceMaster);
