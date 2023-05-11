import { Kore } from "../../structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";

export default class VolumeCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "volume",
            description: "changes the volume on the bot",
            group: "music",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                options: [
                    {
                        name: "volume",
                        description: "0-500",
                        type: ApplicationCommandOptionTypes.NUMBER,
                        required: true
                    },
                ]
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const volumeLevel = interaction.data.options.getNumber(`volume`);
        const player = this.client.vulkava.players.get(`${interaction.guildID}`)

        if(player){
            if(volumeLevel){
                await player.filters.setVolume(volumeLevel)

                interaction.createMessage({
                    embeds: [
                        {
                            author: {
                                name: `Set Volume Level To ${player.volume}`
                            }
                        }
                    ]
                });
            }
        } else {
            interaction.createMessage({
                content: `Please start a queue with /play before checking the queue`
            });
        }
    }
}