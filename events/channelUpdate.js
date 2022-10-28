const { Events } = require("discord.js");

module.exports = {
    name: Events.ChannelUpdate,
    async execute(oldChannel, newChannel) {
        if (newChannel.parent === null) return;

        let cate;
        if (newChannel.type === 4) cate = newChannel;
        else cate = newChannel.parent;


        console.log(cate.id);
    },
};
