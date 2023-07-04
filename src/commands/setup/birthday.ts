import { Kore } from "../../structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";

import Database from "../../structs/database";
import { DMember } from "../../entity/user";
import { DGuild } from "../../entity/guild";

export default class BirthdayCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "birthday",
            description: "shows a list of upcoming birthdays or set your birthday",
            group: "setup",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                options: [
                    {
                        name: "set",
                        description: "set your birthday (mm/dd/yyyy)",
                        type: ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: "channel",
                        description: "sets an announcements channel for birthdays",
                        type: ApplicationCommandOptionTypes.CHANNEL
                    }
                ]
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const manager = await Database.getInstance().getManager()
 
        const set = interaction.data.options.getString("set");
        const channel = interaction.data.options.getChannel("channel");

        if(interaction.member?.id){
            if(await manager.findOne(DMember, {
                where: {
                    MemberID: interaction.member.id
                }
            }) === null) {
                manager.save(DMember, { 
                    MemberID: interaction.member.id
                });
            } else {
                const memberdb = await manager.findOne(DMember, {
                    where: {
                        MemberID: interaction.member.id
                    }
                });

                if(memberdb === null || undefined) return;

                if(set){
                    interaction.createMessage({
                        content: `Set ${interaction.user.mention}'s Birthday to ${set}`
                    });

                    memberdb.Birthday = set
                    manager.save(DMember, memberdb);
                } else {
                    if(channel){
                        if(await manager.findOne(DGuild, {
                            where: {
                                GuildID: interaction.guild?.id
                            }
                        }) === null) {
                            manager.save(DGuild, {
                                GuildID: interaction.guild?.id
                            });
                        } else {
                            const guilddb = await manager.findOne(DGuild, {
                                where: {
                                    GuildID: interaction.guild?.id
                                }
                            });

                            if(guilddb === null || undefined) return;

                            interaction.createMessage({
                                content: `Birthday Channel Set to ${channel.mention}`
                            });

                            guilddb.bdaychannel = channel.id
                            manager.save(DGuild, guilddb);
                        }
                    }
                }
            }
        }
    }
}