import { Kore } from "structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";
import Database from "../../structs/database";
import { DGuild } from "../../entity/guild";

export default class ConfessSetupCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "sconfess",
            description: "setup for the confess feature",
            group: "setup",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                options: [
                    {
                        name: "channel",
                        description: "channel for confessions to post into",
                        required: true,
                        type: ApplicationCommandOptionTypes.CHANNEL
                    },
                    {
                        name: "logger",
                        description: "would you like to log the confessions?",
                        required: false,
                        type: ApplicationCommandOptionTypes.BOOLEAN
                    },
                    {
                        name: "logchannel",
                        description: "channel to log if boolean was set to true",
                        required: false,
                        type: ApplicationCommandOptionTypes.CHANNEL
                    }
                ]
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const manager = await Database.getInstance().getManager()

        const channel = interaction.data.options.getChannel("channel");
        const logger = interaction.data.options.getBoolean("logger");
        const logchannel = interaction.data.options.getChannel("logchannel");

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

                    if(channel){
                        if(logger === true){
                            if(logchannel){
                                guilddb.confessLogger = logchannel.id;
                                guilddb.confessChannel = channel?.id;
    
                                interaction.createMessage({
                                    embeds: [
                                        {
                                            author: {
                                                name: interaction.guild.name
                                            },
                                            
                                            fields: [
                                                {
                                                    name: `Logger Set To`,
                                                    value: `${logchannel.mention}`
                                                },
                                                {
                                                    name: `Confess Channel Set To`,
                                                    value: `${channel.mention}`
                                                }
                                            ]
                                        }
                                    ]
                                });
    
                                manager.save(DGuild, guilddb);
                            } else {
                                interaction.createMessage({
                                    content: "Please Define a log channel"
                                });
                            }
                        } else {
                            guilddb.confessChannel = channel.id;

                            interaction.createMessage({
                                embeds: [
                                    {
                                        author: {
                                            name: interaction.guild.name
                                        },

                                        fields: [
                                            {
                                                name: `Confess Channel Set To`,
                                                value: `${channel.mention}`
                                            }
                                        ]
                                    }
                                ]
                            });

                            manager.save(DGuild, guilddb);
                        }
                    }
                }
            } else {
                interaction.createMessage({
                    content: `You need Administrator permissions to set up the confessions system`
                });
            }
        }
    }
}