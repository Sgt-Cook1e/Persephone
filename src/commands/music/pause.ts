import { Kore } from "../../structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";

export default class PauseCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "pause",
            description: "pause or resume the music",
            group: "music",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const player = this.client.vulkava.players.get(`${interaction.guildID}`)

        if(player){
            await player;

            if(player.paused){
                await player.pause(false);

                interaction.createMessage({
                    embeds: [
                        {
                            author: {
                                name: `Player Resumed`,
                            }
                        }
                    ]
                });
            } else {
                await player.pause(true);

                interaction.createMessage({
                    embeds: [
                        {
                            author: {
                                name: `Player Paused`
                            }
                        }
                    ]
                });
            }
        }
    }
}