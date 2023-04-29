import { Constants } from "oceanic.js";
import Listener  from "../structs/listener";

export default new Listener("ready", false, async function() {
    if (this.firstReady === true) return this.logger.warn("Ready event called after first ready, ignoring.");
    this.firstReady = true;
    this.logger.info(`Launched as ${this.user.username}`);

    this.editStatus('idle', [{name: `God Of ${this.guilds.get(`1083797008608940244`)?.memberCount} Members`, type: Constants.ActivityTypes.GAME}]);

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