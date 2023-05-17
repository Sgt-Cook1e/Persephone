import { Kore } from "../../structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, TextChannel } from "oceanic.js";

import { NightAPI } from "night-api";
import * as dotenv from 'dotenv';
dotenv.config()

export default class HthighCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "nhthigh",
            description: "NSFW Image",
            group: "NSFW",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const api = new NightAPI(`${process.env.NIGHTAPI}`);
        const image = await api.nsfw.fetchImage("hthigh");

        if(this.client.getChannel<TextChannel>(interaction.channelID)?.nsfw === true){
            if(await image){
                interaction.createMessage({
                    embeds: [
                        {
                            author: {
                                name: `Hthigh`,
                                iconURL: interaction.user.avatarURL('jpeg')
                            },
                            
                            image: {
                                url: await image.content.url
                            }
                        }
                    ]
                });
            } else {
                interaction.createMessage({
                    embeds: [
                        {
                            author: {
                                name: `Api Broke Please Try again. or Try again Later`,
                                iconURL: interaction.user.avatarURL('jpeg')
                            }
                        }
                    ]
                })
            }
        } else {
            interaction.createMessage({
                embeds: [
                    {
                        author: {
                            name: `${interaction.guild?.name}, Tried to get a NSFW Command Outside of a nsfw channel`,
                            iconURL: interaction.user.avatarURL('jpeg')
                        },

                        fields: [
                            {
                                name: `${interaction.user.username}`,
                                value: `Please Use the Command In a NSFW Channel`
                            }
                        ],

                        footer: {
                            text: 'Created With Love by Mythic'
                        }
                    }
                ]
            });
        }
    }
}