import { AnyTextChannelWithoutGroup, Message, Uncached } from "oceanic.js";
import { DGuild } from "../entity/guild";
import Listener  from "../structs/listener";
import Database from "../structs/database";

import { LLM } from "llama-node";

import { LLamaCpp } from "llama-node/dist/llm/llama-cpp.js";
import path from "path";

const model = path.resolve(process.cwd(), "../ggml-vicuna-7b-1.1-q4_1.bin");
const llama = new LLM(LLamaCpp);

const config = {
    path: model,
    enableLogging: true,
    nCtx: 1024,
    nParts: -1,
    seed: 0,
    f16Kv: false,
    logitsAll: false,
    vocabOnly: false,
    useMlock: false,
    embedding: false,
    useMmap: true,
};

llama.load(config);

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
                const template = msg.content;
                const prompt = `A chat between a user and an assistant.
                USER: ${template}
                ASSISTANT:`;

                llama.createCompletion({
                    nThreads: 4,
                    nTokPredict: 2048,
                    topK: 40,
                    topP: 0.1,
                    temp: 0.2,
                    repeatPenalty: 1,
                    prompt,
                }, (response) => {
                    process.stdout.write(response.token);
                });
                
            } else {
                return;
            }
        }
    }
});