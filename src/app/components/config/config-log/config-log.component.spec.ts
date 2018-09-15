/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../../../providers/config/config.service';
import { ElectronService } from '../../../providers/electron.service';
import { FileService } from '../../../providers/file/file.service';
import { LogService } from '../../../providers/log-service';
import { ConfigLogComponent } from './config-log.component';

describe('ConfigLogComponent', () => {
    let component: ConfigLogComponent;
    let fixture: ComponentFixture<ConfigLogComponent>;
    let fileService: FileService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormsModule],
            declarations: [ConfigLogComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                FormBuilder,
                ConfigService,
                LogService,
                ElectronService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fileService = TestBed.get(FileService);
        spyOn(fileService, 'pathJoin').and.returnValue('');

        fixture = TestBed.createComponent(ConfigLogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
