import Listener  from "../structs/listener";
import { AnyTextChannelWithoutGroup, Message, Uncached } from "oceanic.js";
import Database from "../structs/database";
import { DGuild } from "../entity/guild";
import { DMember } from "../entity/user";

export default new Listener("messageCreate", false, async function(msg: Message<Uncached | AnyTextChannelWithoutGroup>) {
    let GuildId;
    let MemberId;

    if (msg.member) {
        GuildId = msg.member.guildID
        MemberId = msg.member.id
    } else {
        return;
    }

    const manager = await Database.getInstance().getManager()

    if(GuildId){
        if(await manager.findOne(DGuild, {
            where: {
                GuildID: GuildId
            }
        }) === null) {
            manager.save(DGuild, { 
                GuildID: GuildId
            });
        } else {
            var guilddb = await manager.findOne(DGuild, {
                where: {
                    GuildID: GuildId
                }
            });
            
            if(guilddb === null || undefined) return;

            const list = this.rest.client.guilds.get(GuildId)

            if(guilddb.onlineCount){
                let channel = guilddb.onlineCount;
                const online = list?.members.filter(member => member.presence?.status === "online").length;
                const idle = list?.members.filter(member => member.presence?.status === "idle").length;
                const dnd = list?.members.filter(member => member.presence?.status === "dnd").length;

                if(online === undefined) return;
                if(idle === undefined) return;
                if(dnd === undefined) return;

                this.rest.channels.edit(channel, {
                    name: `🟢 𝓞𝓷𝓵𝓲𝓷𝓮: ${online + idle + dnd}`
                });
            }

            if(MemberId){
                if(await manager.find(DMember, {
                    where: {
                        MemberID: MemberId
                    }
                }) === null) {
                    return;
                }
        
                const memberdb = await manager.findOne(DMember, {
                    where: {
                        MemberID: MemberId
                    }
                });
        
                if(memberdb === null || undefined) return;

                if(guilddb.bdaychannel === null || undefined) return;

                if(memberdb.Birthday){
                    this.rest.channels.getMessages(guilddb.bdaychannel, { limit: 1 }).then(msg => {
                        console.log(msg)
                    });
                }
            }
        }
    }
});