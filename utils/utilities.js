const CateSoiree = require("./models");

// Returner les messages si succès ou échecs

async function getInfoCate(idCate) {
    const cateData = await CateSoiree.findOne({ idCate: idCate });
    return cateData;
}

function createCate(idCate, idOrga) {
    const newCate = new CateSoiree({ idCate: idCate, idOrga: idOrga });
    newCate.save().then(u => console.log(`Nouvelle soiree -> ${u.idCate} organisé par ${u.idOrga} !`));
}

async function deleteCate(idCate) {
    const deletedCate = await getInfoCate(idCate);
    return deletedCate.remove({ id: idCate }).then(u => console.log(`Soirée a pris fin -> ${u.idCate} a été organisé par ${u.idOrga} !`));
}

async function updateCate(idCate, settings) {
    let cateData = await getInfoCate(idCate);
    if (typeof cateData != "object") cateData = {};
    for (const key in settings) {
        if (cateData[key] != settings[key]) cateData[key] = settings[key];
    }
    return cateData.updateOne(settings);
}


// For orga people

async function isAddInvite(idCate, idMember) {
    const cateData = await getInfoCate(idCate);
    if (cateData.listIdInvite.find(element => element == idMember) === undefined) {
        cateData.listIdInvite.push(idMember);
        updateCate(idCate, { listIdInvite: cateData.listIdInvite });
        return true;
    } else {
        return false;
    }
}

async function isRemoveInvite(idCate, idMember) {
    const cateData = await getInfoCate(idCate);
    const indexMember = cateData.listIdInvite.indexOf(idMember);
    if (indexMember !== -1) {
        cateData.listIdInvite.splice(indexMember, 1);
        updateCate(idCate, { listIdInvite: cateData.listIdInvite });
        return true;
    } else {
        return false;
    }
}

async function isOrgaCate(idCate, idMember) {
    const cateData = await getInfoCate(idCate);
    return cateData.idOrga == idMember;
}

module.exports = { getInfoCate, createCate, deleteCate, updateCate, isAddInvite, isRemoveInvite, isOrgaCate };