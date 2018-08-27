import { Injectable } from '@angular/core';

/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

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

    private _log: any;

    /**
     *Creates an instance of LogService.
     * @memberof LogService
     */
    constructor() {
        try {
            this._log = (<any>window).log;
        } catch (err) {
            console.log('Cannot get logger.', err);
        }
    }

    /**
     * Log in trace level.
     * @param {string} message The message to log.
     * @memberof LogService
     */
    trace(message: string) {
        this.log(LogLevel.trace, message);
    }

    /**
     * Log in debug level.
     * @param {string} message The message to log.
     * @memberof LogService
     */
    debug(message: string) {
        this.log(LogLevel.debug, message);
    }

    /**
     * Log in info level.
     * @param {string} message The message to log.
     * @memberof LogService
     */
    info(message: string) {
        this.log(LogLevel.info, message);
    }

    /**
     * Log in warn level.
     * @param {string} message The message to log.
     * @memberof LogService
     */
    warn(message: string) {
        this.log(LogLevel.warn, message);
    }

    /**
     * Log in error level.
     * @param {string} message The message to log.
     * @memberof LogService
     */
    error(message: string) {
        this.log(LogLevel.error, message);
    }

    /**
     * Log in fatal level.
     * @param {string} message The message to log.
     * @memberof LogService
     */
    fatal(message: string) {
        this.log(LogLevel.fatal, message);
    }

    /**
     * Log in the specified level.
     * @param {LogLevel} level Level of log.
     * @param {string} message The message to log.
     * @memberof LogService
     */
    log(level: LogLevel, message: string) {
        if (!this._log) {
            console.log(message);
        }
        switch (level) {
            case LogLevel.trace:
                this._log.debug(message);
                break;
            case LogLevel.debug:
                this._log.verbose(message);
                break;
            case LogLevel.info:
                this._log.info(message);
                break;
            case LogLevel.warn:
                this._log.warn(message);
                break;
            case LogLevel.error:
            case LogLevel.fatal:
                this._log.error(message);
                break;
        }
    }
}
