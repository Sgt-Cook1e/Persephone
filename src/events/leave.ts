import Listener  from "../structs/listener";

export default new Listener("guildMemberRemove", false, async function(member) {
      await(member);
      
      if(member){

         this.rest.channels.createMessage('1099023818011443311', {
            content: `${member.mention}, We Hope you enjoyed your stay`,
         });
      }
});