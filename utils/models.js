const mongoose = require("mongoose");

const soireeSchema = new mongoose.Schema({
    idCate: Number,
    idOrga: Number,
    idPanel: Number,
    listIdInvite: { type: [Number], default: [] },
});

const CateSoiree = mongoose.model("CateSoiree", soireeSchema);

module.exports = CateSoiree;