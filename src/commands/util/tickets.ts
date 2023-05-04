import { Kore } from "../../structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes } from "oceanic.js";

export default class PingCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "ticket",
            description: "create a ticket",
            group: "util",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        if(interaction.guild?.id){
            
        }
    }
}