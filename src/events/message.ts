import { AnyTextChannelWithoutGroup, Message, Uncached } from "oceanic.js";
import fetch from "node-fetch";
import { DGuild } from "../entity/guild";
import Listener  from "../structs/listener";
import Database from "../structs/database";

import { OpenAIApi, Configuration } from "openai";

export const openai = new OpenAIApi(new Configuration({ apiKey: process.env.CHATGPT }));

export default new Listener("messageCreate", false, async function(msg: Message<Uncached | AnyTextChannelWithoutGroup>) {
    if (msg.author.bot) return;
    let GuildId, Member;
    const manager = await Database.getInstance().getManager()
    
    if (msg.member) {
        GuildId = msg.member.guildID
        Member = msg.member.id
    } else {
        return;
    }

    if(msg.member.guild.id){
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

            if(guilddb === null) return;
            
            if(msg.channelID === guilddb.gptChannel){
                const completion = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: `${msg.content}`,
                    temperature: 0,
                    top_p: 1,
                    frequency_penalty: 0.0,
                    presence_penalty: 0.0
                });

                let res = await completion.data.choices[0].text

                if(res){
                    this.rest.channels.createMessage(guilddb.gptChannel, {
                        content: res
                    });
                } else {
                    this.rest.channels.createMessage(guilddb.gptChannel, {
                        content: `ChatGPT Api Broke. Pleas try Again Later.`
                    });
                }
            } else {
                return;
            }
        }
    }
});