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

                if(guilddb.confessChannel === null){
                    interaction.createMessage({
                        content: `Please ask an administrator to setup the confession system`
                    });
                } else {
                    if(guilddb.confessLogger){
                        this.client.rest.channels.createMessage(guilddb.confessChannel, {
                            embeds: [
                                {
                                    author: {
                                        name: `Confessions`
                                    },

                                    fields: [
                                        {
                                            name: `Confessions Used By ${interaction.user.username}`,
                                            value: `Confesstion Said ${confession}`
                                        }
                                    ]
                                }
                            ]
                        });
                    } else {
                        this.client.rest.channels.createMessage(guilddb.confessChannel, {
                            embeds: [
                                {
                                    author: {
                                        name: `Annomous Confession`
                                    },
    
                                    fields: [
                                        {
                                            name: `${confession}`,
                                            value: `Wanna confess something annomously? use /confess`
                                        }
                                    ],
    
                                    footer: {
                                        text: `By posting this confession you agree to the bots rules for confessions.`
                                    }
                                }
                            ]
                        });
                    }

                    this.client.rest.channels.createMessage('1115767244853616711', {
                        embeds: [
                            {
                                author: {
                                    name: `Confessions`
                                },

                                fields: [
                                    {
                                        name: `Confessions Used By: ${interaction.user.username}`,
                                        value: `Confesstion Used In: ${interaction.guild.name}`
                                    },
                                    {
                                        name: `Confession Said:`,
                                        value: `${confession}`
                                    }
                                ]
                            }
                        ]
                    });
                }
            }
        }
    }
}