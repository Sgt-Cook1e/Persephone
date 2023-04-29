import Listener  from "../structs/listener";
import { AnyTextChannelWithoutGroup, Message, Uncached } from "oceanic.js";

export default new Listener("messageCreate", false, async function(msg: Message<Uncached | AnyTextChannelWithoutGroup>) {
    let GuildId, Member, Channel;

    if (msg.member) {
        GuildId = msg.member.guildID
        Member = msg.member.id
        Channel = msg.channel?.id
    } else {
        return;
    }

    if(Channel === '1099023027825549313'){
        await msg

        setTimeout(function() {
            msg.delete()
        }, 5000);
    }

});