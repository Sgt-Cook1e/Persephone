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
                        this.rest.channels.createMessage(channel.id, {
                            content: `Thank You for Inviting Me!`,
                            embeds: [
                                {
                                    title: `Kore`,

                                    author: {
                                        name: this.rest.client.user.username,
                                        iconURL: this.rest.client.user.avatarURL('jpeg'),
                                    },

                                    fields: [
                                        {
                                            name: `Setup Welcomer`,
                                            value: `/wsetup`,
                                        },
                                        {
                                            name: `Global Report System (Beta)`,
                                            value: `/sreport`,
                                        },
                                        {
                                            name: `Support`,
                                            value: `https://mythicxgn.com`,
                                        }
                                    ],
                                }
                            ]
                        });

                        found = 1;
                    }
                }
            });
        }
    } else {
        return;
    }
});