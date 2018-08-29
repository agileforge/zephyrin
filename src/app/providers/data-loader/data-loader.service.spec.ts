/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';
import { DataLoaderService } from './data-loader.service';
import { FileService } from '../file/file.service';
import { LogService } from '../log-service';
import { ElectronService } from '../electron.service';
import { MergeableRowDataModel } from './mergeableRowDataModel';
import { DataLoader } from './data-loader';
import { ExcelDataLoader } from './excel-data-loader';
import { of } from 'rxjs';

export class MockDataLoaderService extends DataLoaderService {

    loader: DataLoader;

    protected getLoader(fileName: string): DataLoader {
        const result = super.getLoader(fileName);
        this.loader = result;
        return result;
    }
}

describe('DataLoaderService', () => {

    let target: MockDataLoaderService;
    let fileServiceStub: FileService;
    let excelDataLoaderStub: ExcelDataLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DataLoaderService, useClass: MockDataLoaderService },
                FileService,
                LogService,
                ElectronService,
                ExcelDataLoader,
            ]
        });

        target = TestBed.get(DataLoaderService);
        fileServiceStub = TestBed.get(FileService);
        excelDataLoaderStub = TestBed.get(ExcelDataLoader);
    });

    it('should be created', inject([DataLoaderService], (service: DataLoaderService) => {
        expect(service).toBeTruthy();
    }));

    describe('fromFile', () => {

        it('should throw exception if file not found', async () => {
            // Arrange
            spyOn(fileServiceStub, 'fileExists').and.returnValue(false);

            try {
                // Act
                await target.fromFile('/not/existing/file').toPromise();
                fail('Should throw error!');
            } catch (err) {
                // Assert
                expect(err.message).toContain('/not/existing/file');
                expect(err.message).toContain('doesn\'t exists');
            }
        });

        it('should throw exception no loader found', async () => {
            // Arrange
            spyOn(fileServiceStub, 'fileExists').and.returnValue(true);

            try {
                // Act
                await target.fromFile('/not/existing/loader.unknownext').toPromise();
                fail('Should throw error!');
            } catch (err) {
                // Assert
                expect(err.message).toContain('/not/existing/loader.unknownext');
                expect(err.message).toContain('No loader found');
            }
        });

        it('should ExcelDataLoader when file is xlsx', async () => {
            // Arrange
            spyOn(fileServiceStub, 'fileExists').and.returnValue(true);
            spyOn(excelDataLoaderStub, 'load').and.returnValue(of([{ a: 'a' }]));

            // Act
            await target.fromFile('/path/to/my/file.xlsx').toPromise();

            // Assert
            expect(target.loader).toEqual(jasmine.any(ExcelDataLoader));
        });

        it('should call load on loader', async () => {
            // Arrange
            spyOn(fileServiceStub, 'fileExists').and.returnValue(true);
            spyOn(excelDataLoaderStub, 'load').and.returnValue(of([{ a: 'a' }]));

            // Act
            await target.fromFile('/path/to/my/file.xlsx').toPromise();

            // Assert
            expect(excelDataLoaderStub.load).toHaveBeenCalledWith('/path/to/my/file.xlsx');
        });

        it('should return loaded data', async () => {
            // Arrange
            const data = [
                { a: 'a' },
                { a: 'b' }
            ];
            spyOn(fileServiceStub, 'fileExists').and.returnValue(true);
            spyOn(excelDataLoaderStub, 'load').and.returnValue(of(data));

            // Act
            const result = await target.fromFile('/path/to/my/file.xlsx').toPromise();

            // Assert
            expect(result).toEqual(data);
        });

    });
});
