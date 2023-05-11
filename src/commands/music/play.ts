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
                        name: "song",
                        description: "song name",
                        type: ApplicationCommandOptionTypes.STRING,
                        required: true
                    },
                    {
                        name: `url`,
                        description: `url for a song`,
                        type: ApplicationCommandOptionTypes.STRING
                    },
                ]
            }
        });
    }

    public async interactionRun(interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>): Promise<void> {
        const url = interaction.data.options.getString(`song`)!;

        const res = await this.client.vulkava.search(url);

        if (res.loadType === "LOAD_FAILED") {
            return interaction.createMessage({
                content: `:x: Load failed. Error: ${res.exception?.message}`
            })
        } else if (res.loadType === "NO_MATCHES") {
            return interaction.createMessage({
                content: ':x: No matches!'
            })
        }
        
        // Creates the audio player
        const player = this.client.vulkava.createPlayer({
            guildId: interaction.guild?.id!,
            voiceChannelId: interaction.member?.voiceState?.channelID!,
            textChannelId: interaction.channel?.id,
            selfDeaf: true
        });
        
        player.connect(); // Connects to the voice channel
        
        if (res.loadType === 'PLAYLIST_LOADED') {
            for (const track of res.tracks) {
                track.setRequester(interaction.user);
                player.queue.add(track);
            }
            
            interaction.createMessage({
                content: `Playlist \`${res.playlistInfo.name}\` loaded!`
            });
        } else {
            const track = res.tracks[0];
            track.setRequester(interaction.user);
            
            player.queue.add(track);
            interaction.createMessage({
                content: `Queued \`${track.title}\``
            });
    
        }
        
        if (!player.playing) player.play();

    }
}