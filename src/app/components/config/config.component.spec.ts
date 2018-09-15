/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectronService } from '../../providers/electron.service';
import { FileService } from '../../providers/file/file.service';
import { LogService } from '../../providers/log-service';
import { ConfigComponent } from './config.component';

describe('ConfigComponent', () => {
    let component: ConfigComponent;
    let fixture: ComponentFixture<ConfigComponent>;
    let fileService: FileService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfigComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                LogService,
                ElectronService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fileService = TestBed.get(FileService);
        spyOn(fileService, 'pathJoin').and.returnValue('');

        fixture = TestBed.createComponent(ConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
