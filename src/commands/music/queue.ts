import { Kore } from "../../structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes } from "oceanic.js";

export default class PauseCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "queue",
            description: "shows the current queue",
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

            if(player.queue){
                
            }
        }
    }
}