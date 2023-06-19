import { Kore } from "../../structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";

import Database from "../../structs/database";
import { DMember } from "../../entity/user";

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
                        name: "upcoming",
                        description: "shows upcoming birthdays",
                        type: ApplicationCommandOptionTypes.BOOLEAN
                    }
                ]
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const manager = await Database.getInstance().getManager()
 
        const set = interaction.data.options.getString("set");
        const upcoming = interaction.data.options.getBoolean("upcoming");

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
                }

                if(upcoming === true){
                    const memberBday = await manager.find(DMember);

                    if(memberBday === null || undefined) return;

                    memberBday.forEach(bday => {
                        const SMonth = new Date(Date.now()).getMonth() + 1;
                        const DMonth = bday.Birthday.split("/")[0];
                        const user = bday.MemberID;

                        if(SMonth.toString() === DMonth){
                            this.client.rest.channels.createMessage(interaction.channelID, {
                                embeds: [
                                    {
                                        author: {
                                            name: `Birthdays`
                                        },
    
                                        fields: [
                                            {
                                                name: ``,
                                                value: `<@${user}>'s Birthday is ${bday.Birthday}`
                                            }
                                        ]
                                    }
                                ]
                            })
                        }
                    })
                } else {
                    return;
                }
            }
        }
    }
}