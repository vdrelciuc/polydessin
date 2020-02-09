import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { IndexService } from '../../services/index/index.service';
import { AppComponent } from './app.component';

import SpyObj = jasmine.SpyObj;
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
    let indexServiceSpy: SpyObj<IndexService>;
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(() => {
        indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet']);
        indexServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));
    });

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [
          { 
              provide: IndexService, 
              useValue: indexServiceSpy 
          }
        ],
        declarations: [ AppComponent ],
        schemas: [NO_ERRORS_SCHEMA]
      });
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
    }));

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it("should have as title 'LOG2990'", () => {
        expect(component.title).toEqual('LOG2990');
    });
});
