import { AnyTextChannelWithoutGroup, Message, Uncached } from "oceanic.js";
import fetch from "node-fetch";
import { DGuild } from "../entity/guild";
import { Tickets } from "../entity/ticket";
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

            if(msg.channelID === '1099023027825549313'){
                await msg

                setTimeout(function() {
                    msg.delete()
                }, 5000);
            }  else {
                if(msg.channelID === guilddb.gptChannel){
                    const completion = await openai.createCompletion({
                        model: "text-davinci-003",
                        prompt: `Your a chatbot, your job is to respond to a user that is chatting to you, respond humanlike to the best of your abilities.
                        USER: ${msg.content}`,
                        temperature: 0,
                        top_p: 1,
                        frequency_penalty: 0.0,
                        presence_penalty: 0.0
                    });
    
                    let res = await completion.data.choices
    
                    if(res[0]){
                        this.rest.channels.createMessage(guilddb.gptChannel, {
                            content: res[0].text
                        });
                    } else {
                        this.rest.channels.createMessage(guilddb.gptChannel, {
                            content: `ChatGPT Api Broke. Pleas try Again Later.`
                        });
                    }
                } else {
                    var tickets = await manager.findOne(Tickets, {
                        where: {
                            GuildID: GuildId
                        }
                    });


                    if(tickets === null) return;


                    if(tickets.Channel){
                        
                    }
                }
            }
        }
    }
});