const CateSoiree = require("./models");

async function getInfoCate(idCate) {
    const cateData = await CateSoiree.findOne({ idCate: idCate });
    return cateData;
}

function createCate(idCate, idOrga) {
    const newCate = new CateSoiree({ idCate: idCate, idOrga: idOrga });
    newCate.save().then(u => console.log(`Nouvelle soiree -> ${u.idCate} organisé par ${u.idOrga} !`));
}

async function updateCate(idCate, settings) {
    let cateData = await getInfoCate(idCate);
    if (typeof cateData != "object") cateData = {};
    for (const key in settings) {
        if (cateData[key] != settings[key]) cateData[key] = settings[key];
    }
    return cateData.updateOne(settings);
}

async function addInvite(idCate, idMember) {
    idCate = await getInfoCate(idCate);
    if (idCate.listIdInvite.find(idMember) != undefined) return; // Warn quand un membre est déjà présent dans la caté
    idCate.listIdInvite.push(idMember);
    updateCate(idCate, { listIdInvite: idCate.listIdInvite });
}

async function removeInvite(idCate, idMember) {
    idCate = await getInfoCate(idCate);
    const indexMember = idCate.listIdInvite.indexOf(idMember);
    if (indexMember == -1) return; // Warn quand un membre n'est déjà pas présent dans la caté
    idCate.listIdInvite.slice(indexMember, 1);
    updateCate(idCate, { listIdInvite: idCate.listIdInvite });
}

module.exports = { getInfoCate, createCate, updateCate, addInvite, removeInvite };