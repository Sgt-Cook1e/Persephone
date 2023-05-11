import { Kore } from "../../structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";
import Database from "../../structs/database";
import { DGuild } from "../../entity/guild";

export default class SreportCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "slogger",
            description: "setup logger system",
            group: "setup",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                options: [
                    {
                        name: "channel",
                        description: "sets the logger channel",
                        type: ApplicationCommandOptionTypes.CHANNEL
                    }
                ]
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const manager = await Database.getInstance().getManager()

        const channel = interaction.data.options.getChannel("channel");

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
                    var guilddb = await manager.findOne(DGuild, {
                        where: {
                            GuildID: interaction.guild.id
                        }
                    });
    
                    if(guilddb === null) return;
    
                    if(channel){
                        guilddb.logger = channel.id
    
                        interaction.createMessage({
                            embeds: [
                                {
                                    author: {
                                        name: interaction.guild.name
                                    },
    
                                    fields: [
                                        {
                                            name: 'Set Logger Channel to',
                                            value: `<#${channel.id}>`
                                        }
                                    ]
                                }
                            ]
                        })
    
                        manager.save(DGuild, guilddb)
                    }
                }
            } else {
                interaction.createMessage({
                    content: `You need Administrator permissions to set this up.`
                });
            }
        }
    }
}