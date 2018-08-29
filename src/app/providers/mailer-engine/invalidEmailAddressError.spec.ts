/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InvalidEmailAddressError } from './invalidEmailAddressError';

describe('InvalidEmailAddressError', () => {

    it('should store data of error', async () => {
        // Arrange
        const fieldName = 'email';
        const row = {
            email: 'jdoe..@somedomain.com',
            field1: 'data',
            field2: 5
        };

        // Act
        const error = new InvalidEmailAddressError(row[fieldName], fieldName, row, 5);

        // Assert
        expect(error.emailAddress).toEqual('jdoe..@somedomain.com');
        expect(error.emailField).toEqual('email');
        expect(error.row).toEqual(row);
        expect(error.rowNum).toEqual(5);
    });

    it('should create message for undefined', async () => {
        // Arrange
        const fieldName = 'email';
        const row = {
            field1: 'data',
            field2: 5
        };

        // Act
        const error = new InvalidEmailAddressError(row[fieldName], fieldName, row, 5);

        // Assert
        expect(error.message).toContain('field \'email\' not found');
        expect(error.message).toContain('line 5');
    });

    it('should create message for null', async () => {
        // Arrange
        const fieldName = 'email';
        const row = {
            email: null,
            field1: 'data',
            field2: 5
        };

        // Act
        const error = new InvalidEmailAddressError(row[fieldName], fieldName, row, 5);

        // Assert
        expect(error.message).toContain('is null');
        expect(error.message).toContain('line 5');
    });

    it('should create message for invalid email', async () => {
        // Arrange
        const fieldName = 'email';
        const row = {
            email: 'invalid..@somedomain.com',
            field1: 'data',
            field2: 5
        };

        // Act
        const error = new InvalidEmailAddressError(row[fieldName], fieldName, row, 6);

        // Assert
        expect(error.message).toContain('invalid..@somedomain.com');
        expect(error.message).toContain('invalid');
        expect(error.message).toContain('line 6');
    });

});
