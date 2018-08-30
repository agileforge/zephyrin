import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfigSenderComponent } from './config-sender.component';

xdescribe('ConfigSenderComponent', () => {
    let component: ConfigSenderComponent;
    let fixture: ComponentFixture<ConfigSenderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfigSenderComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigSenderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
