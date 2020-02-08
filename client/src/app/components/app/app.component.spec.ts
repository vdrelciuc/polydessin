// import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatSidenavModule, MatSliderModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { IndexService } from '../../services/index/index.service';
import { CanvasComponent } from '../canvas/canvas.component';
import { LineComponent } from '../line/line.component';
import { OptionPannelComponent } from '../option-pannel/option-pannel.component';
import { PencilComponent } from '../pencil/pencil.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { AppComponent } from './app.component';

import SpyObj = jasmine.SpyObj;
import { WorkingAreaComponent } from '../working-area/working-area.component';

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
            declarations: [
                AppComponent,
                // RouterTestingModule,
                // HttpClientModule,
                CanvasComponent,
                OptionPannelComponent,
                WorkingAreaComponent,
                SidebarComponent,
                LineComponent,
                PencilComponent,
                WorkspaceComponent ],
              imports: [
                BrowserAnimationsModule,
                MatDialogModule,
                MatSidenavModule,
                RouterModule.forRoot(
                  [
                    { path: '', component: SidebarComponent}
                  ]
                ),
                FormsModule,
                MatSliderModule,
                MatFormFieldModule,
                MatOptionModule,
                MatSelectModule
              ]
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
