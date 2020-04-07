import { async, ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<< HEAD
import { CanvasComponent } from './canvas.component';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { MatSnackBarModule } from '@angular/material';
import { SVGProperties } from 'src/app/classes/svg-html-properties';
=======
import { HttpClientModule } from '@angular/common/http';
import { ElementRef, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { MatSnackBarModule } from '@angular/material';
import { GridService } from 'src/app/services/drawable/grid/grid.service';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';
import { CanvasComponent } from './canvas.component';
>>>>>>> master

describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;

<<<<<<< HEAD
=======
  // tslint:disable-next-line: no-any | Reason : parentElement: Element creates an issue
  const mockedRendered = (parentElement: any, name: string, debugInfo?: string): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

>>>>>>> master
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasComponent ],
      providers: [
        {
        provide: ElementRef,
        useValue: {
            nativeElement: {
                getAttribute: () => '1',
            }
          },
        },
      ],
      imports: [
        HttpClientModule,
        MatSnackBarModule,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should init no history', () => {
    history.pushState({
        continueDrawing: false
    }, 'mockState');
    const spy = spyOn(component['manipulator'], 'setAttribute');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(52);

    component.gridService.thickness.next(10);
    expect(component.thickness).toEqual(10);

    component.gridService.opacity.next(0.5);
    expect(component.opacity).toEqual(0.5);

    const spy3 = spyOn(component.grid.nativeElement, 'setAttribute');
    component.gridService.visible.next(true);
    expect(spy3).toHaveBeenCalledWith(SVGProperties.visibility, 'visible');

    component.gridService.visible.next(false);
    expect(spy3).toHaveBeenCalledWith(SVGProperties.visibility, 'hidden');
  });

  it('#ngOnInit should init to conitnue drawing', () => {
    history.pushState({
        continueDrawing: true
    }, 'mockState');
    localStorage.setItem('myWidth', '100');
    localStorage.setItem('myHeight', '200');
    localStorage.setItem('myColor', '#FFFFFF');
    localStorage.setItem('myInnerSvg', '<svg></svg>');
    const spy = spyOn(component['image'].nativeElement, 'setAttribute');
    component.ngOnInit();
    const allArgs = spy.calls.allArgs();
    expect(allArgs[3]).toEqual([SVGProperties.height, '200']);
    expect(allArgs[4]).toEqual([SVGProperties.width, '100']);
  });
});
