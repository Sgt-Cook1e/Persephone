import { Kore } from "structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";
import Database from "../../structs/database";
import { DGuild } from "../../entity/guild";

export default class WelcomerCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "welcomer",
            description: "setup for the welcomer feature",
            group: "setup",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                options: [
                    {
                        name: "channel",
                        description: "channel for welcomer to post into",
                        required: true,
                        type: ApplicationCommandOptionTypes.CHANNEL
                    },
                    {
                        name: "message",
                        description: "welcomer message",
                        required: true,
                        type: ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: "image",
                        description: "link to the image you want (suggested you use imgur)",
                        required: false,
                        type: ApplicationCommandOptionTypes.STRING
                    }
                ]
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const manager = await Database.getInstance().getManager()

        const wchannel = interaction.data.options.getChannel("channel");
        const wmessage = interaction.data.options.getString("message");
        const wimg = interaction.data.options.getString("image");

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

                    if(wimg){
                        if(wmessage){
                            if(wchannel){
                                guilddb.wchannel = wchannel.id;
                                guilddb.wimg = wimg;
                                guilddb.wmessage = wmessage;

                                interaction.createMessage({
                                    embeds: [
                                        {
                                            author: {
                                                name: interaction.guild.name
                                            },

                                            fields: [
                                                {
                                                    name: `Welcome channel set to`,
                                                    value: `${wchannel.mention}`
                                                },
                                                {
                                                    name: `Welcome Message set to`,
                                                    value: `${wmessage}`
                                                },
                                                {
                                                    name: `Welcome Image set to`,
                                                    value: `Url: ${wimg}`
                                                }
                                            ]
                                        }
                                    ]
                                });

                                manager.save(DGuild, guilddb);
                            }
                        }
                    } else {
                        if(wmessage){
                            if(wchannel){
                                guilddb.wchannel = wchannel.id;
                                guilddb.wmessage = wmessage;
                                
                                interaction.createMessage({
                                    embeds: [
                                        {
                                            author: {
                                                name: interaction.guild.name
                                            },

                                            fields: [
                                                {
                                                    name: `Welcome channel set to`,
                                                    value: `${wchannel.mention}`
                                                },
                                                {
                                                    name: `Welcome Message set to`,
                                                    value: `${wmessage}`
                                                },
                                                {
                                                    name: `Welcome Image set to`,
                                                    value: `**random**`
                                                }
                                            ]
                                        }
                                    ]
                                });

                                manager.save(DGuild, guilddb);
                            }
                        }
                    }
                }
            } else {
                interaction.createMessage({
                    content: `You need Administrator permissions to set up the welcomer.`
                });
            }
        }
    }
}