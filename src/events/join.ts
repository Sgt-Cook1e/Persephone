import Listener  from "../structs/listener";

export default new Listener("guildMemberAdd", false, async function(member) {
      await(member);
      
      if(member){

         this.rest.channels.createMessage('1099023818011443311', {
            content: `Lets give a warm welcome to our newest member ${member.mention}, Please Make Sure To Read Our <#1099021303920476260>, and make sure to <#1099023027825549313>`,
            embeds: [
               {
                  author: {
                     name: member.username,
                     iconURL: member.avatarURL("jpg")
                  },

                  image: {
                     url: 'https://i.imgur.com/jvUiGhv.png'
                  },

                  footer: {
                     text: 'Created With Love By Mythic'
                  }
               }
            ],
         });
      }
});