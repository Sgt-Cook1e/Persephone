import { Yuui } from "structs/Yuui";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes } from "oceanic.js";

export default class PingCommand extends Command {
    constructor(client: Yuui) {
        super(client, {
            name: "ping",
            description: "Get the bot's latency",
            group: "util",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        await interaction.createMessage({
            content: "Pong. " + interaction.guild?.shard.latency + "ms",
        });
    }
}