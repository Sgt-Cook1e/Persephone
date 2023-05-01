import Listener  from "../structs/listener";
import Database from "../structs/database";
import { DGuild } from "../entity/guild";

export default new Listener("guildMemberAdd", false, async function(member) {
    const manager = await Database.getInstance().getManager()
    
    if(member.guild.id){
        if(await manager.findOne(DGuild, {
            where: {
                GuildID: member.guild.id
            }
        }) === null) {
            manager.save(DGuild, { 
                GuildID: member.guild.id
            });
        } else {
            var guilddb = await manager.findOne(DGuild, {
                where: {
                    GuildID: member.guild.id
                }
            });
            
            if(guilddb === null) return;

            if(guilddb.wchannel){
                if(guilddb.wmessage){
                    if(guilddb.wimg){
                        this.rest.channels.createMessage(guilddb.wchannel, {
                            content: `${member.mention}, ${guilddb.wmessage}`,
                            embeds: [
                                {
                                    author: {
                                        name: member.username,
                                        iconURL: member.avatarURL('jpeg')
                                    },

                                    image: {
                                        url: guilddb.wimg
                                    },

                                    footer: {
                                        text: 'Created With Love By Mythic'
                                    }
                                }
                            ]
                        });

                    }
                }
            }

        }
    }
});