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
            return;
        }
    }
});