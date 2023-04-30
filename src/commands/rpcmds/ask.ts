import { Kore } from "structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";

import { Kawaii } from "kawaii-api";
import * as dotenv from 'dotenv';
dotenv.config()

export default class AskCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "ask",
            description: "mention a user to mess with",
            group: "roleplay",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                options: [
                    {
                        name: "user",
                        description: "user to mention",
                        type: ApplicationCommandOptionTypes.USER
                    }
                ],
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const api = new Kawaii(`${process.env.KAWAIITOKEN}`);
        const user = interaction.data.options.getUser("user");
        const data = await api.get("gif", "ask")
        
        if(user){
            if(interaction.user.mention === user.mention){
                interaction.createMessage({
                    content: `We both know if your choosing yourself you must have no friends`
                });
            } else {
                interaction.createMessage({
                    content: `${interaction.user.mention} asked a question for ${user.mention}`,
                    embeds: [
                        {
                            author: {
                                name: user.username,
                                iconURL: user.avatarURL("jpg")
                            },
    
                            image: {
                                url: data
                            },
    
                            footer: {
                                iconURL: this.client.user.avatarURL("jpg"),
                                text: `Created With Love by Mythic`
                            }
                        },
                    ]
                });
            }
        } else {
            interaction.createMessage({
                content: 'Please provide a user'
            });
        }
    }
}