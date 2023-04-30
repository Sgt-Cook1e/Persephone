import { ApplicationCommandOptions, CommandInteraction, Constants, Message, ApplicationCommandTypes } from "oceanic.js";
import { Kore } from "./Kore";

interface SlashOptions {
    enabled: boolean | false;
    type: ApplicationCommandTypes;
    options?: ApplicationCommandOptions[];
    defaultPermission?:  boolean | false;
    precondition?: (client: Kore, interaction : CommandInteraction) => boolean;
}

export interface CommandOptions {
    name: string;
    description: string;
    group: string;
    aliases?: string[];
    usage?: string;
    guildOnly?: boolean;
    dmOnly?: boolean;
    guildOwneronly?: boolean;
    ownerOnly?: boolean;
    permissions?: Iterable<Constants.PermissionName | bigint>;
    customPrecondition?: (message: Message) => boolean;
    slash?: SlashOptions;
}

export type Config = {
    owners: string[];
}