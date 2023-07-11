const { ChannelType, PermissionFlagsBits } = require("discord.js");
const { Party } = require("../../dbObjects");
const { getValidDate } = require("../../functions");

/**
 * Come from the button "Créer une soirée" in the file "src\buttons\panel\createCate.js".
 */

module.exports = {
    data: {
        name: "modal-createCate",
    },
    async execute(interaction) {
        const dateStart = interaction.fields.getTextInputValue("dateStart");
        const dateEnd = interaction.fields.getTextInputValue("dateEnd");

        
        // Check the date format
        const nameVocal = await getValidDate(dateStart, dateEnd, interaction);
        if (nameVocal === "") return;
        
        await interaction.deferReply({ ephemeral: true });

        // Create the category
        const cate = await interaction.guild.channels.create({
            name: `Soirée de ${interaction.member.displayName}`,
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
                        PermissionFlagsBits.SendVoiceMessages,
                        PermissionFlagsBits.Connect,
                        PermissionFlagsBits.Speak,
                        PermissionFlagsBits.Stream,
                        PermissionFlagsBits.UseEmbeddedActivities,
                        PermissionFlagsBits.UseSoundboard,
                        PermissionFlagsBits.UseExternalSounds,
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
        const panelOrganizer = await cate.children.create({
            name: "orga-panel",
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
                        PermissionFlagsBits.SendVoiceMessages,
                    ],
                },
            ],
        });
        const channel_organizer_only = await cate.children.create({
            name: "orga-only",
            type: ChannelType.GuildText,
            topic: "Ce salon offre aux organisateurs un espace privé réservé exclusivement à eux.",
            permissionOverwrites: [
                {
                    id: interaction.member,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                    ],
                },
                {
                    id: interaction.guild.id,
                    allow: [
                        PermissionFlagsBits.MentionEveryone,
                    ],
                    deny: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ManageChannels,
                        PermissionFlagsBits.ManageRoles,
                        PermissionFlagsBits.CreateInstantInvite,
                    ],
                },
            ],
        });
        const withoutOrgaChannel = await cate.children.create({
            name: "sans-orga",
            type: ChannelType.GuildText,
            topic: "Ce salon permet aux personnes de discuter sans organisateur.",
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    allow: [
                        PermissionFlagsBits.MentionEveryone,
                    ],
                    deny: [
                        PermissionFlagsBits.ViewChannel,
                    ],
                },
            ],
        });
        const defaultChannel = await cate.children.create({
            name: "Discussion",
            type: ChannelType.GuildText,
        });
        const vocalChannel = await cate.children.create({
            name: nameVocal,
            type: ChannelType.GuildVoice,
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
                        PermissionFlagsBits.Connect,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                    ],
                },
            ],
        });

        try {
            await Party.create({
                category_id: cateId,
                panel_organizer_id: panelOrganizer.id,
                channel_organizer_only: channel_organizer_only.id,
                channel_without_organizer: withoutOrgaChannel.id,
                channel_date_id: vocalChannel.id,
                organizer_id: interaction.member.id,
            });
        } catch (error) {
            console.error("createCate - " + error);
        }

        return interaction.editReply({
            content: `J'ai bien créer ta catégorie pour accueillir ta soirée avec ce salon : ${defaultChannel} !`,
            ephemeral: true,
        });
    },
};