/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Represents a simplified email data.
 * @export
 * @interface MailModel
 */
export interface MailModel {
    /**
     * Email address of sender.
     * @type {string}
     * @memberof MailModel
     */
    from: string;
    /**
     * Email addresse(s) of receiver(s).
     * @type {string}
     * @memberof MailModel
     */
    to: string[];
    /**
     * Email addresse(s) where to send copy.
     * @type {string[]}
     * @memberof MailModel
     */
    cc?: string[];
    /**
     * Email addresse(s) where to send hidden copy.
     * @type {string[]}
     * @memberof MailModel
     */
    cci?: string[];
    /**
     * Subject of email.
     * @type {string}
     * @memberof MailModel
     */
    subject: string;
    /**
     * Body of email considering that this is HTML.
     * @type {string}
     * @memberof MailModel
     */
    body: string;
    /**
     * Array of byte array that represents attachements for the email.
     * Each row is a byte array that represents an attachement.
     * @type {object[]}
     * @memberof MailModel
     */
    attachments: any[][];
}
