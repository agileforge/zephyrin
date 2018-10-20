/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MIMETYPE_DOCX, MIMETYPE_PDF, MIMETYPE_TXT, MIMETYPE_XLSX } from './const';
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

    describe('getMimeType', () => {

        it('should return null if not found', () => {
            // Act
            const result = Utils.getMimeType('/some/path/file.unknownext');

            // Assert
            expect(result).toBeNull();
        });

        it('should return null if fileName is null or undefined', () => {
            // Act
            const resultNull = Utils.getMimeType(null);
            const resultUndefined = Utils.getMimeType(undefined);

            // Assert
            expect(resultNull).toBeNull();
            expect(resultUndefined).toBeNull();
        });

        it('should throw error if file path is not compliant', () => {
            // Act & Assert
            expect(() => { Utils.getMimeType('someFileWithoutExt'); }).toThrow();
        });

        it('should return right mime types', () => {
            // Act & assert
            expect(Utils.getMimeType('/some/path/file.pdf')).toEqual(MIMETYPE_PDF);
            expect(Utils.getMimeType('/some/path/file.docx')).toEqual(MIMETYPE_DOCX);
            expect(Utils.getMimeType('C:\\ssome\\path\\file.xlsx')).toEqual(MIMETYPE_XLSX);
            expect(Utils.getMimeType('file.txt')).toEqual(MIMETYPE_TXT);
        });

    });

    describe('getMimeTypeExtension', () => {

        it('should return empty string if not found', () => {
            // Act
            const result = Utils.getMimeTypeExtension('nonExistingMimeType');

            // Assert
            expect(result).toEqual('');
        });

        it('should return empty string if mimeType is null or undefined', () => {
            // Act
            const resultNull = Utils.getMimeTypeExtension(null);
            const resultUndefined = Utils.getMimeTypeExtension(undefined);

            // Assert
            expect(resultNull).toEqual('');
            expect(resultUndefined).toEqual('');
        });

        it('should return right extension', () => {
            // Act & assert
            expect(Utils.getMimeTypeExtension(MIMETYPE_PDF)).toEqual('.pdf');
            expect(Utils.getMimeTypeExtension(MIMETYPE_DOCX)).toEqual('.docx');
            expect(Utils.getMimeTypeExtension(MIMETYPE_XLSX)).toEqual('.xlsx');
            expect(Utils.getMimeTypeExtension(MIMETYPE_TXT)).toEqual('.txt');
        });

    });

    describe('getPropertyCI', () => {
        it('should return value if property name exactly same', async () => {
            // Arrange
            const data = { one: 'one', two: 'two', three: 'three' };

            // Act
            const result = Utils.getPropertyCI(data, 'two');

            // Arrange
            expect(result.toString()).toEqual('two');
        });

        it('should return value if property name not same case', async () => {
            // Arrange
            const data = { one: 'one', two: 'two', three: 'three' };

            // Act
            const result = Utils.getPropertyCI(data, 'tWo');

            // Arrange
            expect(result.toString()).toEqual('two');
        });

        it('should return undefined if property not found', async () => {
            // Arrange
            const data = { one: 'one', two: 'two', three: 'three' };

            // Act
            const result = Utils.getPropertyCI(data, 'unknown');

            // Arrange
            expect(result).toBeUndefined();
        });
    });

});
