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
            var weldb = await manager.findOne(DGuild, {
                where: {
                    GuildID: member.guild.id
                }
            });
            
            if(weldb === null) return;

            if(weldb.wchannel){
                if(weldb.wmessage){
                    if(weldb.wimg){
                        this.rest.channels.createMessage(weldb.wchannel, {
                            content: member.mention,
                            embeds: [
                                {
                                    author: {
                                        name: member.username,
                                        iconURL: member.avatarURL('jpeg')
                                    },

                                    fields: [
                                        {
                                            name: weldb.wmessage,
                                            value: ''
                                        }
                                    ],

                                    image: {
                                        url: weldb.wimg
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