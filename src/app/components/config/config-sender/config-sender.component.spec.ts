/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ElectronService } from '../../../providers/electron.service';
import { FileService } from '../../../providers/file/file.service';
import { LogService } from '../../../providers/log-service';
import { ConfigSenderComponent } from './config-sender.component';

describe('ConfigSenderComponent', () => {
    let component: ConfigSenderComponent;
    let fixture: ComponentFixture<ConfigSenderComponent>;
    let fileService: FileService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormsModule],
            declarations: [ConfigSenderComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                FormBuilder,
                LogService,
                ElectronService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fileService = TestBed.get(FileService);
        spyOn(fileService, 'pathJoin').and.returnValue('');

        fixture = TestBed.createComponent(ConfigSenderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
