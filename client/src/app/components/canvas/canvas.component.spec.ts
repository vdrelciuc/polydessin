import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasComponent } from './canvas.component';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, Renderer2, ElementRef } from '@angular/core';
import { MatSnackBarModule } from '@angular/material';
import { GridService } from 'src/app/services/index/drawable/grid/grid.service';
import { UndoRedoService } from 'src/app/services/tools/undo-redo/undo-redo.service';

fdescribe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;

  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasComponent ],
      providers: [
        {
          provide: Renderer2,
          useValue: {
            createElement: () => mockedRendered,
            setAttribute: () => mockedRendered,
            appendChild: () => mockedRendered,
            removeChild: () => mockedRendered,
          },
        },
        {
          provide: ElementRef,
          useValue: {
            nativeElement: {
              children: {
                length: 3
              },
              innerHTML: 'bla',
              getBoundingClientRect: () => {
                const boundleft = 0;
                const boundtop = 0;
                const boundRect = {
                    left: boundleft,
                    top: boundtop,
                };
                return boundRect;
              },
            },
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

  it('#ngOnInit should init component', () => {
    const spy = spyOn(component['toolSelector'], 'initialize').and.callFake( ()  => null);
    const spy2 = spyOn(component['toolSelector'], 'getGrid').and.callFake( ()  => new GridService());
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('#resetCanvas should reset default filters', () => {
    component['toolSelector'].memory = {
      clear: () => null
    } as unknown as UndoRedoService;
    component['filters'] = 'test';
    component.resetCanvas();
    expect(component['image'].nativeElement.innerHTML).toEqual('test');
  });
});
