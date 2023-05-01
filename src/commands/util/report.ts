import { Kore } from "structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";
import Database from "../../structs/database";
import { DGuild } from "../../entity/guild";

export default class WelcomeCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "report",
            description: "report a user",
            group: "setup",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                options: [
                    {
                        name: "user-id",
                        description: "id of the user to report",
                        type: ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: "username",
                        description: "username of the reported user",
                        type: ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: "reason",
                        description: "reason to report user",
                        type: ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: "proof",
                        description: "proof of what the user did (link to image)",
                        type: ApplicationCommandOptionTypes.STRING
                    }
                ]
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const manager = await Database.getInstance().getManager()

        const userid = interaction.data.options.getString("user-id");
        const username = interaction.data.options.getString("username");
        const reason = interaction.data.options.getString("reason");
        const proof = interaction.data.options.getString("proof");

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

                if(guilddb.rchannel){
                    let db = await manager.find(DGuild, {
                        select: {
                            rchannel: true
                        }
                    });

                    await db.map(res => {
                        if(res.rchannel === undefined) return;

                        this.client.rest.channels.createMessage(res.rchannel, {
                            embeds: [
                                {
                                    author: {
                                        name: `Global Report from: ${interaction.guild?.name}, ${interaction.guild?.id}`,
                                    },

                                    fields: [
                                        {
                                            name: `Reported User`,
                                            value: `${username}`
                                        },
                                        {
                                            name: `User ID`,
                                            value: `${userid}`
                                        },
                                        {
                                            name: `Reason`,
                                            value: `${reason}`
                                        },
                                        {
                                            name: `Proof`,
                                            value: `${proof}`
                                        },
                                        {
                                            name: `Reported By`,
                                            value: `${interaction.user.username}, ${interaction.user.id}`
                                        }
                                    ]

                                }
                            ]
                        });
                    });

                    interaction.createMessage({
                        content: `Report Sent to Staff & All Servers!`
                    });
                }

            }
        }
    }
}