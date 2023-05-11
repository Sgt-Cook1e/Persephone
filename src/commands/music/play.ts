import { Kore } from "../../structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";

import * as dotenv from 'dotenv';
dotenv.config();

export default class PingCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "play",
            description: "plays a song",
            group: "music",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                options: [
                    {
                        name: `url`,
                        description: `url for a song`,
                        type: ApplicationCommandOptionTypes.STRING
                    }
                ]
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const url = interaction.data.options.getString(`url`);

    }
}