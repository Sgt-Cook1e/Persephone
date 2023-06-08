import { Kore } from "structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, Permissions, ChannelTypes } from "oceanic.js";
import Database from "../../structs/database";
import { DGuild } from "../../entity/guild";

export default class ServerStatsCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "serverstats",
            description: "setup the server-stats feature",
            group: "setup",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const manager = await Database.getInstance().getManager()

        if(interaction.guild?.id){
            if(interaction.member?.permissions.has("ADMINISTRATOR")){
                if(await manager.findOne(DGuild, {
                    where: {
                        GuildID: interaction.guild.id
                    }
                }) === null) {
                    manager.save(DGuild, { 
                        GuildID: interaction.guild.id
                    });
                } else {
                    const guilddb = await manager.findOne(DGuild, {
                        where: {
                            GuildID: interaction.guild.id
                        }
                    });

                    if(guilddb === null || undefined) return;

                    const list = this.client.guilds.get(interaction.guild.id)

                    const category = this.client.rest.guilds.createChannel(interaction.guild.id, ChannelTypes.GUILD_CATEGORY, {
                        name: `📊 𝒮𝑒𝓇𝓋𝑒𝓇 𝒮𝓉𝒶𝓉𝓈`
                    });

                    const users = list?.memberCount

                    const memberCount = this.client.rest.guilds.createChannel(interaction.guild.id, ChannelTypes.GUILD_VOICE, {
                        name: `🫂 𝓜𝓮𝓶𝓫𝓮𝓻𝓼: ${users}`,
                        parentID: (await category).id,
                        permissionOverwrites: [
                            {
                                id: `${interaction.guild.id}`,
                                type: 0,
                                deny: Permissions.CONNECT,
                                allow: Permissions.VIEW_CHANNEL
                            }
                        ]
                    });

                    const bots = list?.members.filter(members => members.bot).length

                    const botsCount = this.client.rest.guilds.createChannel(interaction.guild.id, ChannelTypes.GUILD_VOICE, {
                        name: `🤖 𝓑𝓸𝓽𝓼: ${bots}`,
                        parentID: (await category).id,
                        permissionOverwrites: [
                            {
                                id: `${interaction.guild.id}`,
                                type: 0,
                                deny: Permissions.CONNECT,
                                allow: Permissions.VIEW_CHANNEL
                            }
                        ]
                    });

                    const online = list?.members.filter(member => member.presence?.status === "online").length;
                    const idle = list?.members.filter(member => member.presence?.status === "idle").length;
                    const dnd = list?.members.filter(member => member.presence?.status === "dnd").length;

                    if(online === undefined) return;
                    if(idle === undefined) return;
                    if(dnd === undefined) return;

                    const onlineCount = this.client.rest.guilds.createChannel(interaction.guild.id, ChannelTypes.GUILD_VOICE, {
                        name: `🟢 𝓞𝓷𝓵𝓲𝓷𝓮: ${online + idle + dnd}`,
                        parentID: (await category).id,
                        permissionOverwrites: [
                            {
                                id: `${interaction.guild.id}`,
                                type: 0,
                                deny: Permissions.CONNECT,
                                allow: Permissions.VIEW_CHANNEL
                            }
                        ]
                    });

                    interaction.createMessage({
                        embeds: [
                            {
                                author: {
                                    name: `Server Stats`
                                },

                                fields: [
                                    {
                                        name: `Member Count`,
                                        value: `${(await memberCount).mention}`
                                    },
                                    {
                                        name: `Bot Count`,
                                        value: `${(await botsCount).mention}`
                                    },
                                    {
                                        name: `Members Online`,
                                        value: `${(await onlineCount).mention}`
                                    }
                                ],

                                footer: {
                                    text: `Online Member Counter is all members that have a active status on discord online, dnd, and idle.`
                                }
                            }
                        ]
                    })

                    guilddb.memberCount = (await memberCount).id
                    guilddb.botsCount = (await botsCount).id
                    guilddb.onlineCount = (await onlineCount).id
                    manager.save(DGuild, guilddb);
                }
            } else {
                interaction.createMessage({
                    content: `You need Administrator permissions to set up the confessions system`
                });
            }
        }
    }
}