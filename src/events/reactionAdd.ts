import Listener  from "../structs/listener";

export default new Listener("messageReactionAdd", false, async function(message, member, reaction) {
    
    if(member.id === this.rest.client.user.id) return;
    if(message.guild?.id === null) return;
    if(reaction === null) return;

    // this.logger.warn(`
    // Reaction Added
    // Reaction Name: ${reaction.name}
    // Reaction ID: ${reaction.id}
    // Message ID: ${message.id}
    // Guild ID: ${message.guild?.id}`);


    if(reaction.name === '3949excitedhearts'){
        if(reaction.id === '1096427129589223485'){
            let guildID = message.guildID

            const userRoles = this.rest.client.guilds.get(`${guildID}`)?.members.get(member.id)

            if(userRoles === null) return;
            
            if(userRoles?.roles.filter((f) => f.includes('1092550957671387137'))){
                userRoles.removeRole('1092550842063790140');
            }
        }
    }
});