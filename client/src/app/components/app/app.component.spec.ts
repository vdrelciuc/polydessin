// import { HttpClientModule } from '@angular/common/http';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { IndexService } from '../../services/index/index.service';
import { AppComponent } from './app.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule, MatSliderModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatDialogModule } from '@angular/material';
import { OptionPannelComponent } from '../option-pannel/option-pannel.component';
import { LineComponent } from '../line/line.component';
import { PencilComponent } from '../pencil/pencil.component';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CanvasComponent } from '../canvas/canvas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
                    { path: "", component: SidebarComponent}
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
