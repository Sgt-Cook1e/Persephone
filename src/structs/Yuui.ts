import { Client, ClientOptions, Collection } from 'oceanic.js'; 
import * as winston from 'winston';
import { createLogger, Logger } from "winston"
import config from '../config'
import { Command } from './command';
import { Config } from './types';
import { Handler } from './handler';

export class Yuui extends Client {
    public logger: Logger;
    public handler: Handler;
    public commands: Collection<string, Command>;
    public alias: Collection<string, string>;
    public config: Config;
    firstReady = false;

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
        })
        this.config = config;
    }
}