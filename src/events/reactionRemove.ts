import Listener  from "../structs/listener";

export default new Listener("messageReactionRemove", false, async function(message, member, reaction) {
    
    if(member.id === this.rest.client.user.id) return;
    if(message.guild?.id === null) return;
    if(reaction === null) return;

    this.logger.warn(`
    Reaction Removed
    Reaction Name: ${reaction.name}
    Reaction ID: ${reaction.id}
    Message ID: ${message.id}
    Guild ID: ${message.guild?.id}`);
});