import { Kore } from "structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";
import Database from "../../structs/database";
import { DGuild } from "../../entity/guild";

export default class PingCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "wsetup",
            description: "setups welcomer",
            group: "setup",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                options: [
                    {
                        name: "channel",
                        description: "sets the welcome channel",
                        type: ApplicationCommandOptionTypes.CHANNEL
                    },
                    {
                        name: "message",
                        description: "sets the welcome message",
                        type: ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: "image",
                        description: "link to the image",
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
            if(await manager.findOne(DGuild, {
                where: {
                    GuildID: interaction.guild.id
                }
            }) === null) {
                manager.save(DGuild, { 
                    GuildID: interaction.guild.id
                });
            } else {
                var weldb = await manager.findOne(DGuild, {
                    where: {
                        GuildID: interaction.guild.id
                    }
                });

                if(weldb === null) return;

                if(wchannel){
                    if(wmessage){
                        if(wimg){
                            weldb.wchannel = weldb.wchannel + wchannel.id;
                            weldb.wimg = weldb.wimg + wimg;
                            weldb.wmessage = weldb.wmessage + wmessage;

                            interaction.createMessage({
                                embeds: [
                                    {
                                        author: {
                                            name: interaction.guild.name,
                                        },

                                        fields: [
                                            {
                                                name: `Welcome channel set to`,
                                                value: `${wchannel.id}`
                                            },
                                            {
                                                name: `Welcome Message set to`,
                                                value: `${wmessage}`
                                            },
                                            {
                                                name: `Welcome Image set to`,
                                                value: `Url: ${wimg}`
                                            }
                                        ],

                                        footer: {
                                            text: 'Created With Love by Mythic'
                                        }
                                    }
                                ]
                            });

                            manager.save(DGuild, weldb)
                        }
                    }
                }


            }
        }
    }
}