import { ApplicationCommandOptions, CommandInteraction, Constants, Message } from "oceanic.js";
import { CommandOptions } from "./types";
import { Kore } from "./Kore";

export abstract class Command {
    protected client: Kore;
    public options: CommandOptions;

    constructor(client: Kore, options: CommandOptions) {
        this.client = client;
        this.options = options;
    }

    public interactionRun (interaction: CommandInteraction): void | Promise<void> {}
    public messageContext (interaction: CommandInteraction): void | Promise<void> {}
    public userContext (interaction: CommandInteraction): void | Promise<void> {}
}