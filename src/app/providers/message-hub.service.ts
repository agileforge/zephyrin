/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

/**
 * Allow to send and receive messages over th whole application.
 * @export
 * @class MessageHubService
 */
@Injectable({
    providedIn: 'root'
})
export class MessageHubService {

    private _messageHosts = new Map<string, any>();

    constructor() { }

    /**
     * Subscribe to a message identified by name.
     * @template TMessage Type of message.
     * @param {string} name The name of message type.
     * @returns {Observable<TMessage>} The observable on this type of message.
     * @memberof MessageHubService
     */
    register<TMessage>(name: string): Observable<TMessage> {
        let observable = <ReplaySubject<TMessage>>this._messageHosts.get(name);
        if (!observable) {
            observable = new ReplaySubject<TMessage>();
            this._messageHosts.set(name, observable);
        }
        return observable;
    }

    /**
     * Emit an empty message to all subscribed.
     * @template TMessage
     * @param {string} name The name of message type.
     * @memberof MessageHubService
     */
    emit(name: string): void {
        this.emitMessage(name, <string>null);
    }

    /**
     * Emit a new message to all subscribed.
     * @template TMessage
     * @param {string} name The name of message type.
     * @param {TMessage} message Type of message.
     * @memberof MessageHubService
     */
    emitMessage<TMessage>(name: string, message?: TMessage): void {
        let observable = <ReplaySubject<TMessage>>this._messageHosts.get(name);
        if (!observable) {
            observable = new ReplaySubject<TMessage>();
            this._messageHosts.set(name, observable);
        }
        observable.next(message);
    }

}
