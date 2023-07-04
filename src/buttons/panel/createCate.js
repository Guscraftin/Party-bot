const { ChannelType, PermissionFlagsBits } = require("discord.js");
const { createCate, isMaxCate } = require("../../_utils/utilities");

module.exports = {
    data: {
        name: "createCate",
    },
    async execute(interaction) {
        const maxCate = 3;

        if (await isMaxCate(interaction.member.id, maxCate)) {
            return interaction.reply({
                content: `Tu ne peux plus créer de nouvelles soirées (catégorie) car tu as déjà \`${maxCate}\` catégories.`,
                ephemeral: true,
            });
        }

        let nameCate = "nobody";
        if (interaction.member.nickname != null) nameCate = interaction.member.nickname;
        else if (interaction.member.user.username) nameCate = interaction.member.user.username;

        const cate = await interaction.guild.channels.create({
            name: `Soirée de ${nameCate}`,
            type: ChannelType.GuildCategory,
            position: 0,
            permissionOverwrites: [
                {
                    id: interaction.member,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ManageChannels,
                        PermissionFlagsBits.ManageRoles,
                        PermissionFlagsBits.ManageWebhooks,
                        PermissionFlagsBits.CreateInstantInvite,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.SendMessagesInThreads,
                        PermissionFlagsBits.CreatePublicThreads,
                        PermissionFlagsBits.CreatePrivateThreads,
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.AddReactions,
                        PermissionFlagsBits.UseExternalEmojis,
                        PermissionFlagsBits.UseExternalStickers,
                        PermissionFlagsBits.MentionEveryone,
                        PermissionFlagsBits.ManageMessages,
                        PermissionFlagsBits.ManageThreads,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendTTSMessages,
                        PermissionFlagsBits.UseApplicationCommands,
                        PermissionFlagsBits.Connect,
                        PermissionFlagsBits.Speak,
                        PermissionFlagsBits.Stream,
                        PermissionFlagsBits.UseEmbeddedActivities,
                        PermissionFlagsBits.UseVAD,
                        PermissionFlagsBits.PrioritySpeaker,
                        PermissionFlagsBits.MuteMembers,
                        PermissionFlagsBits.DeafenMembers,
                        PermissionFlagsBits.MoveMembers,
                        PermissionFlagsBits.ManageEvents,
                    ],
                },
                {
                    id: interaction.guild.id,
			        deny: [PermissionFlagsBits.ViewChannel],
                },
            ],
        }).then(categorie => categorie).catch(console.error);

        const cateId = cate.id;
        const privatePanel = await cate.children.create({
            name: "Panel orga",
            type: ChannelType.GuildText,
            topic: "Ce salon permet au bot de communiquer avec toi concernant cette soirée. *Notamment si des personnes la quitte.*",
            permissionOverwrites: [
                {
                    id: interaction.member,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                    ],
                },
                {
                    id: interaction.guild.id,
			        deny: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ManageChannels,
                        PermissionFlagsBits.ManageRoles,
                        PermissionFlagsBits.ManageWebhooks,
                        PermissionFlagsBits.CreateInstantInvite,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.SendMessagesInThreads,
                        PermissionFlagsBits.CreatePublicThreads,
                        PermissionFlagsBits.CreatePrivateThreads,
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.AddReactions,
                        PermissionFlagsBits.UseExternalEmojis,
                        PermissionFlagsBits.UseExternalStickers,
                        PermissionFlagsBits.MentionEveryone,
                        PermissionFlagsBits.ManageMessages,
                        PermissionFlagsBits.ManageThreads,
                        PermissionFlagsBits.SendTTSMessages,
                        PermissionFlagsBits.UseApplicationCommands,
                    ],
                },
            ],
        });
        const defaultChannel = await cate.children.create({
            name: "Discussion",
            type: ChannelType.GuildText,
        });

        createCate(cateId, interaction.member.id, privatePanel.id);

        return interaction.reply({
            content: `J'ai bien créer ta catégorie pour accueillir ta soirée avec ce salon : <#${defaultChannel.id}> !`,
            ephemeral: true,
        });
    },
};