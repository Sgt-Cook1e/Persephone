import { Constants } from "oceanic.js";
import Listener  from "../structs/listener";

export default new Listener("ready", false, async function() {
    if (this.firstReady === true) return this.logger.warn("Ready event called after first ready, ignoring.");
    this.firstReady = true;
    this.vulkava.start(this.user.id)
    this.logger.info(`Launched as ${this.user.username}`);

    this.editStatus('idle', [{name: `Protecting ${this.rest.client.guilds.size} Guild`, type: Constants.ActivityTypes.GAME}]);

        // const commands = this.application.getGlobalCommands();

        // for (const command of await commands) {
        //     await command.delete();
        //     this.logger.debug(`Cleared last set of Global Commands`);
        // }

        this.commands.forEach((command) => {
        if (command.options.slash) {
            this.application.createGlobalCommand({
                name: command.options.name,
                description: command.options.description,
                type: command.options.slash.type,
                options: command.options.slash.options
            })
            this.logger.debug(`Created Global Command for ${command.options.name}`)
        }
    });
});