import Listener  from "../structs/listener";
import Database from "../structs/database";
import { DGuild } from "../entity/guild";
import { ChannelTypes } from "oceanic.js";

export default new Listener("guildCreate", false, async function(guild) {
    const manager = await Database.getInstance().getManager()
    await guild.id

    if(guild.id){
        if(await manager.findOne(DGuild, {
            where: {
                GuildID: guild.id
            }
        }) === null) {
            manager.save(DGuild, { 
                GuildID: guild.id
            });
        } else {
            let found = 0;
            guild.channels.find((channel) => {
                if(found === 0){
                    if(channel.type === ChannelTypes.GUILD_TEXT){
                        if(channel.permissionsOf(this.user.id).has("VIEW_CHANNEL") === true) {
                            if(channel.permissionsOf(this.user.id).has("SEND_MESSAGES") === true) {
                                this.rest.channels.createMessage(channel.id, {
                                    embeds: [
                                        {
                                            title: 'Setup Kore',

                                            author: {
                                                name: this.rest.client.user.username,
                                                iconURL: this.rest.client.user.avatarURL('jpeg'),
                                                url: 'https://mythicxgn.com'
                                            },

                                            fields: [
                                                {
                                                    name: 'Hello!, Im Kore',
                                                    value: 'My goal. To Make Vrchat & Discord Clubs a better and safer place. run /setup to start!'
                                                },

                                                {
                                                    name: 'Rember I am an application command bot. all my commands are / commands I dont have a prefix',
                                                    value: ''
                                                }
                                            ],

                                            footer: {
                                                text: 'Created With Love By Mythic'
                                            }
                                        }
                                    ]
                                });

                                found = 1;
                            }
                        }
                    }
                }
            });
        }
    } else {
        return;
    }
});