/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import * as winston from 'winston';
import { format } from 'winston';

/**
 * Enumerates all possible log level
 * @enum {number}
 */
export enum LogLevel {
    trace,
    debug,
    info,
    warn,
    error,
    fatal
}

/**
 * Provide an injectable and abstract logger.
 * @export
 * @class LogService
 */
@Injectable()
export class LogService {

    private _logger: winston.Logger;

    private get logger(): winston.Logger {
        if (this._logger) {
            return this._logger;
        }

        this._logger = winston.createLogger({
            level: 'verbose',
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            ),
            transports: [
                new winston.transports.Console({ format: format.printf(info => info.message) }),
                new winston.transports.File({ filename: 'logs/zephyrin.error.log', level: 'error' }),
                new winston.transports.File({ filename: 'logs/zephyrin.log', level: 'info' })
            ]
        });
    }

    /**
     *Creates an instance of LogService.
     * @memberof LogService
     */
    constructor() { }

    /**
     * Log in trace level.
     * @param {string} message The message to log.
     * @memberof LogService
     */
    trace(...message: any[]) {
        this.log(LogLevel.trace, ...message);
    }

    /**
     * Log in debug level.
     * @param {string} message The message to log.
     * @memberof LogService
     */
    debug(...message: any[]) {
        this.log(LogLevel.debug, ...message);
    }

    /**
     * Log in info level.
     * @param {string} message The message to log.
     * @memberof LogService
     */
    info(...message: any[]) {
        this.log(LogLevel.info, ...message);
    }

    /**
     * Log in warn level.
     * @param {string} message The message to log.
     * @memberof LogService
     */
    warn(...message: any[]) {
        this.log(LogLevel.warn, ...message);
    }

    /**
     * Log in error level.
     * @param {string} message The message to log.
     * @memberof LogService
     */
    error(...message: any[]) {
        this.log(LogLevel.error, ...message);
    }

    /**
     * Log in fatal level.
     * @param {string} message The message to log.
     * @memberof LogService
     */
    fatal(...message: any[]) {
        this.log(LogLevel.fatal, ...message);
    }

    /**
     * Log in the specified level.
     * @param {LogLevel} level Level of log.
     * @param {string} message The message to log.
     * @memberof LogService
     */
    log(level: LogLevel, ...message: any[]) {
        if (!message || message.length === 0) {
            return;
        }
        if (!this.logger) {
            console.log(...message);
            return;
        }
        const msg = message[0];
        let meta = [];
        if (message.length > 1) {
            meta = message.slice(1);
        }
        switch (level) {
            case LogLevel.trace:
                this.logger.verbose(msg, ...meta);
                break;
            case LogLevel.debug:
                this.logger.debug(msg, ...meta);
                break;
            case LogLevel.info:
                this.logger.info(msg, ...meta);
                break;
            case LogLevel.warn:
                this.logger.warn(msg, ...meta);
                break;
            case LogLevel.error:
                this.logger.error(msg, ...meta);
                break;
            case LogLevel.fatal:
                this.logger.emerg(msg, ...meta);
                break;
        }
    }
}
