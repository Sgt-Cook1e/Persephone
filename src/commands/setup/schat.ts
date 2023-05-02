import { Kore } from "structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";
import Database from "../../structs/database";
import { DGuild } from "../../entity/guild";

export default class SchatCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "schat",
            description: "sets the gpt chat system",
            group: "setup",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                options: [
                    {
                        name: "channel",
                        description: "sets the gpt channel",
                        type: ApplicationCommandOptionTypes.CHANNEL
                    }
                ]
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const manager = await Database.getInstance().getManager()

        const gptChannel = interaction.data.options.getChannel("channel");

        if(interaction.guild?.id){
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

                if(gptChannel){
                    guilddb.gptChannel = gptChannel.id;

                    interaction.createMessage({
                        embeds: [
                            {
                                author: {
                                    name: interaction.guild.name
                                },

                                fields: [
                                    {
                                        name: 'Set Reports Channel to',
                                        value: `<#${gptChannel.id}>`
                                    }
                                ]
                            }
                        ]
                    })

                    manager.save(DGuild, guilddb)
                }   

            }
        }
    }
}