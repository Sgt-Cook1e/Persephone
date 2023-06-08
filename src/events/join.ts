import Listener  from "../structs/listener";
import Database from "../structs/database";
import { DGuild } from "../entity/guild";

import { Kawaii } from "kawaii-api";
import * as dotenv from 'dotenv';
dotenv.config()

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
            
            if(guilddb === null || undefined) return;

            const list = this.rest.client.guilds.get(member.guild.id)

            if(guilddb.memberCount){
                let channel = guilddb.memberCount;
                const users = list?.memberCount

                this.rest.channels.edit(channel, {
                    name: `🫂 𝓜𝓮𝓶𝓫𝓮𝓻𝓼: ${users}`
                });
            }

            if(guilddb.botsCount){
                let channel = guilddb.botsCount;
                const bots = list?.members.filter(members => members.bot).length;

                this.rest.channels.edit(channel, {
                    name: `🤖 𝓑𝓸𝓽𝓼: ${bots}`
                });
            }
            
            if(guilddb.wimg){
                if(guilddb.wchannel){
                    if(guilddb.wmessage){
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
                                    }
                                }
                            ]
                        });
                    }
                }
            } else {
                if(guilddb.wchannel){
                    if(guilddb.wmessage){
                        const api = new Kawaii(`${process.env.KAWAIITOKEN}`);
                        const data = await api.get("gif", "wave");

                        this.rest.channels.createMessage(guilddb.wchannel, {
                            content: `${member.mention}, ${guilddb.wmessage}`,
                            embeds: [
                                {
                                    author: {
                                        name: member.username,
                                        iconURL: member.avatarURL('jpeg')
                                    },

                                    image: {
                                        url: data
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