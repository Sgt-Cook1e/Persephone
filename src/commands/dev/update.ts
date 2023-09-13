import { execSync } from "child_process";
import { AnyTextChannelWithoutGroup, ApplicationCommandOptionTypes, ApplicationCommandTypes, CommandInteraction, Uncached,  } from "oceanic.js";
import { Command } from "../../structs/command";
import { Kore } from "../../structs/Kore";

export default class UpdateCommand extends Command {
    constructor(client: Kore) {
        super(client, {
            name: "update",
            description: "update the bot",
            group: "dev",
            slash: {
                enabled: true,
                type: ApplicationCommandTypes.CHAT_INPUT,
                precondition: (client, interaction) => {
                    return client.config.owners.includes(interaction.member!.id)
                },
                options: [
                    {
                        name: "exit",
                        description: "If the bot should restart after updating",
                        type: ApplicationCommandOptionTypes.BOOLEAN,
                        required: true
                    }
                ]
            }
        });
    }

    public interactionRun(interaction: CommandInteraction<Uncached | AnyTextChannelWithoutGroup>): void | Promise<void> { 
        interaction.defer();      
        const out = execSync('git pull').toString();
        let file;
        if (out.length >= 950) file = out;
        const latest = execSync("git log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit -5")
        const exit = interaction.data.options.getBoolean('exit');
        const noChanges = out.includes("Already up to date.");

        if (file === undefined) {
            interaction.createFollowup({
                content: `Success. ${noChanges ? `No changes were made. ${exit ? " Not exiting." : ""}` : `${exit ? " Exiting in 2 seconds." : " Not exiting."}\n\nCommit Info:\n${latest.join("\n")}`}${(file === undefined) ? `\n\`\`\`sh\nOutput:\n${out}\`\`\`` : undefined}`,
            })
        } else {
            interaction.createFollowup({
                content: `Success. ${noChanges ? `No changes were made. ${exit ? " Not exiting." : ""}` : `${exit ? " Exiting in 2 seconds." : " Not exiting."}\n\nCommit Info:\n${latest.join("\n")}`}${(file === undefined) ? `\n\`\`\`sh\nOutput:\n${out}\`\`\`` : undefined}`,
                attachments: [
                    { id: "4", description: file, filename: 'output.txt' },
                ]
            })
        }
        if (exit && !noChanges) setTimeout(() => process.exit(0), 2e3);
    }
}