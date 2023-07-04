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
                        name: `msg`,
                        description: `message to say after a user leaves`,
                        type: ApplicationCommandOptionTypes.STRING,
                        required: true
                    },
                    {
                        name: `channel`,
                        description: `channel for leaver to post into`,
                        type: ApplicationCommandOptionTypes.CHANNEL,
                        required: true
                    }
                ]
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const manager = await Database.getInstance().getManager()

        const channel = interaction.data.options.getChannel("channel");
        const msg = interaction.data.options.getString("message");

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
                        if(msg){
                            guilddb.lchannel = channel.id;
                            guilddb.lmsg = msg;

                            interaction.createMessage({
                                embeds: [
                                    {
                                        author: {
                                            name: interaction.guild.name
                                        },
                                        
                                        fields: [
                                            {
                                                name: `Leave channel set to`,
                                                value: `${channel.mention}`
                                            },
                                            {
                                                name: `Leave Message set to`,
                                                value: `${msg}`
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
                    content: `You need Administrator permissions to set up the welcomer.`
                });
            }
        }
    }
}