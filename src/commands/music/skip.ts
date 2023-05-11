import { Kore } from "../../structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";

export default class SkipCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "skip",
            description: "skip the current song",
            group: "music",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                options: [
                    {
                        name: `number`,
                        description: `ammount of tracks to skip`,
                        type: ApplicationCommandOptionTypes.NUMBER,
                        required: false
                    }
                ]
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const player = this.client.vulkava.players.get(`${interaction.guildID}`)
        const number = interaction.data.options.getNumber('number');

        if(player){
            await player;
            if(number){
                await player.skip(number)
                interaction.createMessage({
                    embeds: [
                        {
                            author: {
                                name: `Skipped ${number} tracks`
                            }
                        }
                    ]
                });
            } else {
                await player.skip(1)
                interaction.createMessage({
                    embeds: [
                        {
                            author: {
                                name: `Track Skipped`
                            },

                            fields: [
                                {
                                    name: ``,
                                    value: ``
                                }
                            ]
                        }
                    ]
                })
            }
        }
    }
}