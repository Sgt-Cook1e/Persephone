import { Kore } from "../../structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";

export default class StopCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "stop",
            description: "stops the music entirely",
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

            await player.destroy()
            interaction.createMessage({
                embeds: [
                    {
                        author: {
                            name: `Stopped the Music and leaving Vc`
                        }
                    }
                ]
            });
        }
    }
}