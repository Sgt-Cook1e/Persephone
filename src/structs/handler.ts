import { Kore } from "./Kore";
import { Command } from "./command";
import Listener  from "./listener";
import glob from 'glob';
import { AnyInteractionGateway, Constants } from "oceanic.js";

export class Handler {
    protected client: Kore;

    constructor(client: Kore) {
        this.client = client;

        this.loadCommands().then(() => this.client.logger.info(`Loaded ${this.client.commands.size} commands.`)).catch((err) => console.log(err));
        this.loadListeners().then(() => this.client.logger.info(`Loaded Listeners.`));
        this.client.on('interactionCreate', this.handleInteraction.bind(this));
    }

    public async loadCommands() {
        const commandFiles = glob.sync(`${process.cwd()}/build/commands/**/*{.ts,.js}`);
        const promises = commandFiles.map(async (file) => {
            let target;
            if (process.platform === "linux") {
                target = await import(`${file}`);
            } else {
                target = await import(`${process.cwd()}/${file}`);
            }
            if ("default" in target) target = target.default; 
            const targetFile: Command = new target(this.client);
            if (this.client.commands.has(targetFile.options.name)) return;
            if (targetFile.options.name.length < 3 && targetFile.options.slash?.enabled) {
                throw new TypeError('Commands which have slash enabled must be atleast 3 characters long.');
            }
            this.client.commands.set(targetFile.options.name, targetFile);
            const commandAliases = targetFile.options.aliases as Array<any>;
            if (targetFile.options.aliases) {
                commandAliases.forEach(alias => {
                    this.client.alias.set(alias, targetFile.options.name);
                });
            }
        });

        await Promise.all(promises)
    }

    private fetchCommand(commandName: string) {
        return this.client.commands.get(commandName) || this.client.commands.get(this.client.alias.get(commandName) as string);
    }

    public handleInteraction(interaction: AnyInteractionGateway) {
        if (interaction.type !== Constants.InteractionTypes.APPLICATION_COMMAND) return;
        const command: Command | undefined = this.fetchCommand(interaction.data.name);
        if (!command || !command.options?.slash?.enabled) return;
        if (command.options.slash.precondition && !command.options.slash.precondition(this.client, interaction)) return;
        if (command.options.permissions && !interaction.member?.permissions.has(...command.options.permissions)) return;
        if (command.options.guildOnly && !interaction.guildID) return;
        if (command.options.dmOnly && interaction.guildID) return;
        if (command.options.guildOwneronly && interaction.guildID && interaction.guild?.ownerID !== interaction.member?.id) return;
        if (command.options.ownerOnly) {
            const user = interaction.member?.id || interaction.user?.id;
            if (!user || !this.client.config.owners.includes(user)) return;
        }
    
        switch (interaction.data.type) {
            case Constants.ApplicationCommandTypes.CHAT_INPUT:
                command.interactionRun(interaction);
                break;
            case Constants.ApplicationCommandTypes.USER:
                command.userContext(interaction);
                break;
            case Constants.ApplicationCommandTypes.MESSAGE:
                command.messageContext(interaction);
                break;
        }
        
    }

    public async loadListeners() {
        const ListenerFiles = glob.sync(`${process.cwd()}/build/events/**/*{.ts,.js}`);
        const promises = ListenerFiles.map(async (file) => {
            let target;
            if (process.platform === "linux") {
                target = await import(`${file}`) as Listener | { default: Listener };
            } else {
                target = await import(`${process.cwd()}/${file}`) as Listener | { default: Listener };
            }
            if ("default" in target) target = target.default; 
            if (target.once) {
                this.client.once(target.name, target.listener.bind(this.client));
            } else {
                this.client.on(target.name, target.listener.bind(this.client));
            }
        });
        await Promise.all(promises);
    }
}