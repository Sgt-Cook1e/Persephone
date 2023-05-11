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
                    id: `boobs`,
                    hostname: process.env.LAVALINKHOST!,
                    port: 25569,
                    password: process.env.LAVALINKPASS
                }
            ],
            sendWS: (guildId, payload) => {
                this.rest.client.guilds.get(guildId)?.shard.send(payload.op, payload.d)
            }
        })

        this.vulkava.on('trackStart', (player, track) => {
            const channel = this.getChannel(player.textChannelId!)!;
            
            console.log(`Now playing \`${track.title}\``)
            this.channelGuildMap
            // channel.(`Now playing \`${track.title}\``);
        });
        
        // Fired when the queue ends
        this.vulkava.on('queueEnd', (player) => {
            const channel = this.getChannel(player.textChannelId!)!;
            
            console.log('queue ended!')
            // channel.send(`Queue ended!`);
            
            player.destroy();
        });
        
        // This event is needed to catch any errors that occur on Vulkava
        this.vulkava.on('error', (node, err) => {
            console.error(`[Vulkava] Error on node ${node.identifier}`, err.message);
        });
        this.vulkava.on('debug', (message) => {
            console.error(`[Vulkava] debug ${message}`);
        });
        

        this.config = config;
    }
}