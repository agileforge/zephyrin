/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Provides user configuration.
 * @export
 * @interface ConfigModel
 */
export interface ConfigModel {
    /**
     * Contains information about SMTP connection to send emails.
     * This is given by user.
     * @type {SmtpConfigModel}
     * @memberof ConfigModel
     */
    smtp: SmtpConfigModel;
    /**
     * Contains information about the sender of mails.
     * @type {SenderConfigModel}
     * @memberof ConfigModel
     */
    sender: SenderConfigModel;
    /**
     * Contains information about mailing logging.
     * @type {MailingLogConfigModel}
     * @memberof ConfigModel
     */
    mailingLog: MailingLogConfigModel;
}

/**
 * Represents user information about SMTP connection to send emails.
 * @export
 * @interface SmtpConfigModel
 */
export interface SmtpConfigModel {
    /**
     * The host address of SMTP server.
     * @type {string}
     * @memberof SmtpConfigModel
     */
    host: string;
    /**
     * The port number of SMTP server.
     * @type {number}
     * @memberof SmtpConfigModel
     */
    port: number;
    /**
     * True if the communication with SMTP host is trough SSL.
     * @type {boolean}
     * @memberof SmtpConfigModel
     */
    isSsl: boolean;
    /**
     * The user name for SMTP connection.
     * @type {string}
     * @memberof SmtpConfigModel
     */
    userName?: string;
    /**
     * The password of SMTP connection.
     * @type {string}
     * @memberof SmtpConfigModel
     */
    password?: string;
}

/**
 * Represents sender informations that will be set to 'from' field in the mail.
 * @export
 * @interface SenderConfigModel
 */
export interface SenderConfigModel {
    /**
     * The email address of sender.
     * @type {string}
     * @memberof SenderConfigModel
     */
    emailAddress: string;
    /**
     * The full name of sender.
     * @type {string}
     * @memberof SenderConfigModel
     */
    fullName: string;
}

/**
 * Represents informations that will be used to log a mailing.
 * @export
 * @interface MailingLogConfigModel
 */
export interface MailingLogConfigModel {
    /**
     * The path to directory where all log files will be stored.
     * @type {string}
     * @memberof MailingLogConfigModel
     */
    directoryPath: string;
}
