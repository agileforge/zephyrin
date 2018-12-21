/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// #region Regular expressions

/**
 * Regular expression that verify if a string is a valid email address.
 */
// tslint:disable-next-line:max-line-length
export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const FILE_COMPLIANT_REGEX = /^(?:[\w]\:|\\)?([\\\/]?[\w_\-\s\d\.]+)+(\..+)$/;

// #endregion

// #region Mime types

export const MIMETYPE_TXT = 'text/plain';
export const MIMETYPE_PDF = 'application/pdf';
export const MIMETYPE_DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const MIMETYPE_XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// #endregion

// #region Misc

export const FILEDATE_FORMAT = 'yyyymmdd_HHMMss';
export const ISODATE_FORMAT = 'yyyy-mm-dd HH:MM:ss';

// #endregion

// #region Message names

export const MSG_CONFIG_NOK = 'config-nok';
export const MSG_MISSING_DATASOURCE = 'missing-datasource';
export const MSG_MISSING_EMAILDATA = 'missing-emaildata';
export const MSG_CANCEL_SENDING = 'cancel-sending';
export const MSG_MAILINGDATA_LOADED = 'mailing-data-loaded';
export const MSG_MAILINGLOG_SAVED = 'mailing-log-saved';
export const MSG_DATASOURCE_FIELDS_LOADED = 'datasource-fields-loaded';

// #endregion
