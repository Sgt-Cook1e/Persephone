import { Kore } from "structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes } from "oceanic.js";

export default class PingCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "setup",
            description: "setup Kore",
            group: "admin",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        
    }
}