import { Kore } from "../../structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes } from "oceanic.js";

export default class ServerCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "servers",
            description: "shows the bots current servers",
            group: "dev",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                precondition: (client, interaction) => {
                    return client.config.owners.includes(interaction.member!.id)
                }
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const channelID = interaction.channel?.id;

        if(channelID === null || undefined) return;

        this.client.guilds.forEach(guild => {
            this.client.rest.channels.createMessage(`${channelID}`, {
                content: `${guild.name} | ${guild.id}`
            });
        });
    }
}