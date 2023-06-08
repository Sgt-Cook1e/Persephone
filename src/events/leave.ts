import Listener  from "../structs/listener";
import Database from "../structs/database";
import { DGuild } from "../entity/guild";

import { Kawaii } from "kawaii-api";
import * as dotenv from 'dotenv';
dotenv.config()

export default new Listener("guildMemberRemove", false, async function(member, guild) {
    const manager = await Database.getInstance().getManager()
    
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
            var guilddb = await manager.findOne(DGuild, {
                where: {
                    GuildID: guild.id
                }
            });
            
            if(guilddb === null || undefined) return;

            const list = this.rest.client.guilds.get(guild.id)

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
        }
    }
});