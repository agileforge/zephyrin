/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';
import Utils from './utils';

describe('utils', () => {

    describe('getEmailAddress', () => {

        it('only email address arguments', async () => {
            // Act
            const result = Utils.getEmailAddress('john.doe@somedomain.ch');

            // Assert
            expect(result).toEqual('john.doe@somedomain.ch');
        });

        it('email address and full name', async () => {
            // Act
            const result = Utils.getEmailAddress('john.doe@somedomain.ch', 'John Doe');

            // Assert
            expect(result).toEqual('John Doe <john.doe@somedomain.ch>');
        });

        it('email address, full name and last name, all trimmed', async () => {
            // Act
            const result = Utils.getEmailAddress(' john.doe@somedomain.ch  ', 'Doe ', ' John');

            // Assert
            expect(result).toEqual('John Doe <john.doe@somedomain.ch>');
        });

    });

});
