import { execSync } from "child_process";
import { AnyTextChannelWithoutGroup, ApplicationCommandOptionTypes, ApplicationCommandTypes, CommandInteraction, Uncached,  } from "oceanic.js";
import { Command } from "../../structs/command";
import { Kore } from "structs/Kore";
import Database from "../../structs/database";
import { DGuild } from "../../entity/guild";

export default class UpdateCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "datatool",
            description: "dev datatool",
            group: "dev",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                precondition: (client, interaction) => {
                    return client.config.owners.includes(interaction.member!.id)
                },
                options: [
                    {
                        name: "database",
                        description: "database to change or show",
                        type: ApplicationCommandOptionTypes.STRING,
                    },
                    {
                        name: "guilds",
                        description: "true = show, false = dont",
                        type: ApplicationCommandOptionTypes.BOOLEAN
                    }
                ]
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> { 
        const manager = await Database.getInstance().getManager()

        const database = interaction.data.options.getString("database");
        const guilds = interaction.data.options.getBoolean("guilds");

        const Gdb = await manager.find(DGuild, {
            select: {
                rchannel: true
            }
        });

        if(database === 'guildDB'){
            this.client.rest.channels.createMessage(interaction.channelID, {
                embeds: [
                    {
                        fields: [
                            {
                                name: `Guilds Registered in guildDB`,
                                value: `${Gdb.length}`
                            },
                            {
                                name: `Guild ID's Registered within guildDB`,
                                value: `${Gdb.map(res => res.GuildID)}`
                            },
                            {
                                name: `Report Channel ID's Registered within guildDB`,
                                value: `${Gdb.map(res => res.rchannel)}`
                            },
                            {
                                name: `Welcome Channel ID's Registered within guildDB`,
                                value: `${Gdb.map(res => res.wchannel)}`
                            },
                            {
                                name: `Welcome Img urls Registered within guildDB`,
                                value: `${Gdb.map(res => res.wimg)}`
                            },
                            {
                                name: `Welcome Messages Registered within guildDB`,
                                value: `${Gdb.map(res => res.wmessage)}`
                            },
                        ]
                    }
                ]
            });
        }

        if(guilds === true){
            this.client.rest.channels.createMessage(interaction.channelID, {
                embeds: [
                    {
                        fields: [
                            {
                                name: `Global Guild List of the ${this.client.user.username}`,
                                value: `${this.client.guilds.map(guild => guild.name + " " + guild.id)}`
                            }
                        ]
                    }
                ]
            });
        }

        
    }
}