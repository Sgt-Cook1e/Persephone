import { Yuui as client } from './structs/Yuui';
import * as dotenv from 'dotenv';

dotenv.config()

const Yuui = new client({ auth: `Bot ${process.env.TOKEN}`,
gateway: { intents: [ 'GUILD_MEMBERS', 'ALL' ]  }});

Yuui.connect();