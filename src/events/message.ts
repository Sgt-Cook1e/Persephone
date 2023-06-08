import Listener  from "../structs/listener";
import { AnyTextChannelWithoutGroup, Message, Uncached } from "oceanic.js";
import Database from "../structs/database";
import { DGuild } from "../entity/guild";

export default new Listener("messageCreate", false, async function(msg: Message<Uncached | AnyTextChannelWithoutGroup>) {
    let GuildId;

    if (msg.member) {
        GuildId = msg.member.guildID
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
        }
    }
});