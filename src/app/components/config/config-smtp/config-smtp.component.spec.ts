import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ElectronService } from '../../../providers/electron.service';
import { FileService } from '../../../providers/file/file.service';
import { LogService } from '../../../providers/log-service';
import { ConfigSmtpComponent } from './config-smtp.component';

describe('ConfigSmtpComponent', () => {
    let component: ConfigSmtpComponent;
    let fixture: ComponentFixture<ConfigSmtpComponent>;
    let fileService: FileService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormsModule],
            declarations: [ConfigSmtpComponent],
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

        fixture = TestBed.createComponent(ConfigSmtpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
