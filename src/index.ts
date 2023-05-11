import { Kore as client } from './structs/Kore';
import * as dotenv from 'dotenv';
dotenv.config()

const Kore = new client({ auth: `Bot ${process.env.TOKEN}`,
gateway: { intents: [ 'GUILD_MEMBERS', 'GUILD_VOICE_STATES', 'ALL' ]  }});

Kore.connect();