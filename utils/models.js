const mongoose = require("mongoose");

const soireeSchema = new mongoose.Schema({
    idCate: String,
    idOrga: String,
    idPanel: String,
    listIdInvite: { type: [String], default: [] },
});

const CateSoiree = mongoose.model("CateSoiree", soireeSchema);

module.exports = CateSoiree;