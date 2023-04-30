import { Kore as client } from './structs/Kore';
import * as dotenv from 'dotenv';

dotenv.config()

const Kore = new client({ auth: `Bot ${process.env.TOKEN}`,
gateway: { intents: [ 'GUILD_MEMBERS', 'ALL' ]  }});

Kore.connect();