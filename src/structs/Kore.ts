import { Client, ClientOptions, Collection } from 'oceanic.js'; 
import * as winston from 'winston';
import { createLogger, Logger } from "winston"
import config from '../config'
import { Command } from './command';
import { Config } from './types';
import { Handler } from './handler';

import { Vulkava } from 'vulkava';

export class Kore extends Client {
    public logger: Logger;
    public handler: Handler;
    public commands: Collection<string, Command>;
    public alias: Collection<string, string>;
    public config: Config;
    firstReady = false;
    vulkava: Vulkava;

    public constructor (options?: ClientOptions) {   
        super(options);

        this.commands = new Collection<string, Command>();
        this.alias = new Collection<string, string>();
        this.handler = new Handler(this);

        this.logger = createLogger({
            level: process.env.NODE_ENV === "production" ? "info" : "debug",
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            ]
        });

        this.vulkava = new Vulkava({
            nodes: [
                {
                    id: ``,
                    hostname: ``,
                    port: 2333,
                    password: process.env.LAVALINKPASS
                }
            ],
            sendWS: (guildId, payload) => {
                this.rest.client.guilds.get(guildId)?.shard.send(payload.op, payload.d)
            }
        })

        this.vulkava.on('raw', (packet) => this.vulkava.handleVoiceUpdate(packet));


        this.config = config;
    }
}