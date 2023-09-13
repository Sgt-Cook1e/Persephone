import Listener  from "../structs/listener";
import { AnyTextChannelWithoutGroup, Message, Uncached } from "oceanic.js";
import Database from "../structs/database";
import { DGuild } from "../entity/guild";
import { DMember } from "../entity/user";
import OpenAI from "openai";

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

    if(GuildId || MemberId){
        if(await manager.findOne(DGuild, {
            where: {
                GuildID: GuildId
            }
        }) === null) {
            manager.save(DGuild, { 
                GuildID: GuildId
            });
        } else {
            if(await manager.findOne(DMember, {
                where: {
                    MemberID: MemberId
                }
            }) === null) {
                manager.save(DMember, {
                    MemberID: MemberId
                })
            } else {
                const guilddb = await manager.findOne(DGuild, {
                    where: {
                        GuildID: GuildId
                    }
                });

                const memberdb = await manager.findOne(DMember, {
                    where: {
                        MemberID: MemberId
                    }
                });

                if(guilddb === null) return;
                if(memberdb === null) return;

                const list = this.rest.client.guilds.get(GuildId)

                //Guild Count
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

                //ChatGPT
                if(guilddb.chatgptEnabled === true){
                    if(guilddb.chatgptChannel){
                        if(msg.content === undefined) return;
                        if(guilddb.chatgptChannel === msg.channelID){
                            const openai = new OpenAI({
                                apiKey: process.env.OPENAI,
                            });
        
                            async function main() {
                                const stream = await openai.chat.completions.create({
                                    model: 'babbage-002',
                                    messages: [{role: 'user', content: msg.content}],
                                    stream: true
                                });
        
                                msg.channel?.sendTyping()
                                msg.channel?.createMessage({
                                    content: `${stream}`
                                });
                                
                            }
                            
                            main();
                        }
                    }
                }
            }
        }
    }
});