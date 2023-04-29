import { ApplicationCommandOptions, CommandInteraction, Constants, Message } from "oceanic.js";
import { CommandOptions } from "./types";
import { Yuui } from "./Yuui";

export abstract class Command {
    protected client: Yuui;
    public options: CommandOptions;

    constructor(client: Yuui, options: CommandOptions) {
        this.client = client;
        this.options = options;
    }

    public interactionRun (interaction: CommandInteraction): void | Promise<void> {}
    public messageContext (interaction: CommandInteraction): void | Promise<void> {}
    public userContext (interaction: CommandInteraction): void | Promise<void> {}
}