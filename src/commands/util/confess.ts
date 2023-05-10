import { Kore } from "../../structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";

import Database from "../../structs/database";
import { DGuild } from "../../entity/guild";

export default class PingCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "confess",
            description: "confess annomously",
            group: "util",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                options: [
                    {
                        name: `confession`,
                        description: `write an annomous confession`,
                        type: ApplicationCommandOptionTypes.STRING
                    }
                ]
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const manager = await Database.getInstance().getManager()

        const confession = interaction.data.options.getString('confession');

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

                    if(guilddb.cchannel === null){
                        interaction.createMessage({
                            content: `Please as a Administrator to setup the confessions. with /sconfess`
                        });

                        return;
                    }

                    if(confession){
                        await this.client.rest.channels.createMessage(guilddb.cchannel, {
                            embeds: [
                                {
                                    fields: [
                                        {
                                            name: `Annomous Confession`,
                                            value: `${confession}`
                                        }
                                    ],

                                    footer: {
                                        text: `Created with Love by MythicXGN`
                                    }
                                }
                            ]
                        });
                    }
                }
            }
        }
    }
}