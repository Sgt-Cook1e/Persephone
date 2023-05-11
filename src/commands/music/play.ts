import { Kore } from "../../structs/Kore";
import { Command } from "../../structs/command";
import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, ApplicationCommandTypes, ApplicationCommandOptionTypes } from "oceanic.js";

export default class PlayCommand extends Command {
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
                    }
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
        
        const player = this.client.vulkava.createPlayer({
            guildId: interaction.guild?.id!,
            voiceChannelId: interaction.member?.voiceState?.channelID!,
            textChannelId: interaction.channel?.id,
            selfDeaf: true,
        });
        
        player.connect();
        
        if (res.loadType === 'PLAYLIST_LOADED') {
            for (const track of res.tracks) {
                track.setRequester(interaction.user);
                player.queue.add(track);
            }
            
            interaction.createMessage({
                embeds: [
                    {
                        author: {
                            name: `${res.playlistInfo.name} playlist added to queue by ${interaction.user.username}`,
                            iconURL: interaction.user.avatarURL('jpg')
                        },

                        fields: [
                            {
                                name: ``,
                                value: ``
                            }
                        ]

                    }
                ]
            });
        } else {
            const track = res.tracks[0];
            track.setRequester(interaction.user);
            
            player.queue.add(track);

            var ms = track.duration
            var min = Math.floor((ms/1000/60) << 0)
            var sec = Math.floor((ms/1000) % 60);

            interaction.createMessage({
                embeds: [
                    {
                        author: {
                            name: `${interaction.user.username} Added To Queue`,
                            iconURL: interaction.user.avatarURL('jpg')
                        },

                        fields: [
                            {
                                name: `${track.title}: By ${track.author}`,
                                value: `${min}:${sec}`
                            }
                        ]
                    }
                ]
            });
        }
        
        if (!player.playing) player.play();

    }
}