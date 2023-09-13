import { Kore } from "../../structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";
import Database from "../../structs/database";
import { DGuild } from "../../entity/guild";

export default class ChatGPTCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "chatgpt",
            description: "implements chatgpt for all users to use",
            group: "setup",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                options: [
                    {
                        name: "enabled",
                        description: "enable chatgpt",
                        type: ApplicationCommandOptionTypes.BOOLEAN,
                        required: true
                    },
                    {
                        name: "channel",
                        description: "channel for chatgpt to use",
                        type: ApplicationCommandOptionTypes.CHANNEL,
                        required: true
                    }
                ]
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const manager = await Database.getInstance().getManager()
        
        const enabled = interaction.data.options.getBoolean("enabled");
        const channel = interaction.data.options.getChannel("channel");

        if(interaction.guild?.id){
            if(await manager.findOne(DGuild, {
                where: {
                    GuildID: interaction.guild.id
                }
            }) === null) {
                manager.save(DGuild, {
                    GuildID: interaction.guild.id
                })
            } else {
                const guilddb  = await manager.findOne(DGuild, {
                    where: {
                        GuildID: interaction.guild.id
                    }
                });

                if(guilddb === null) return;

                if(enabled){
                    if(channel){
                        guilddb.chatgptChannel = channel.id;
                        guilddb.chatgptEnabled = enabled;

                        manager.save(DGuild, guilddb);

                        interaction.createMessage({
                            embeds: [
                                {
                                    author: {
                                        name: `Chat-GPT`
                                    },

                                    fields: [
                                        {
                                            name: `Enabled:`,
                                            value: `${enabled}`
                                        },

                                        {
                                            name: `Channel:`,
                                            value: `${channel.mention}`
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
}