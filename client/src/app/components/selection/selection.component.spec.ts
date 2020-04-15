// tslint:disable: no-string-literal | Reason: used to access private variables
// tslint:disable: no-any | Reason: used for mocked spies
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Transform } from 'src/app/classes/transformations';
import { SVGProperties } from 'src/app/enums/svg-html-properties';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { SelectionComponent } from './selection.component';

describe('SelectionComponent', () => {
  let component: SelectionComponent;
  let fixture: ComponentFixture<SelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectionComponent
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component['selectionService'].resizeGroup = document.createElementNS(SVGProperties.nameSpace, SVGProperties.g);
    component['selectionService'].resizeGroup.remove = jasmine.createSpy().and.returnValue(undefined);
    component['selectionService'].pushElement = jasmine.createSpy().and.returnValue(undefined);
    component['selectionService'].setGeneratedAreaBorders = jasmine.createSpy().and.returnValue(undefined);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#pasteDisabled should retrieve paste button status from ClipBoardService', () => {
    const spy = spyOn<any>(ClipboardService, 'pasteDisabled').and.callFake(() => undefined);
    component.pasteDisabled();
    expect(spy).toHaveBeenCalled();
  });

  it('#copyCutDupDelDisabled should retrieve copy-paste-cut-duplicate button status from selection service', () => {
    const spy = spyOn<any>(component['selectionService'], 'hasNoSelection').and.callFake(() => undefined);
    component.copyCutDupDelDisabled();
    expect(spy).toHaveBeenCalled();
  });

  it('#selectAll should select all elements using selection service', () => {
    const spy = spyOn<any>(component['selectionService'], 'selectAllElements').and.callFake(() => undefined);
    component.selectAll();
    expect(spy).toHaveBeenCalled();
  });

  it('#copy should delegate task to ClipBoardService', () => {
    const spy = spyOn<any>(ClipboardService, 'copy').and.callFake(() => undefined);
    component.copy();
    expect(spy).toHaveBeenCalled();
  });

  it('#paste should delegate task to ClipBoardService', () => {
    const spy = spyOn<any>(ClipboardService, 'paste').and.callFake(() => undefined);
    component.paste();
    expect(spy).toHaveBeenCalled();
  });

  it('#cut should delegate task to ClipBoardService', () => {
    const spy = spyOn<any>(ClipboardService, 'cut').and.callFake(() => undefined);
    component.cut();
    expect(spy).toHaveBeenCalled();
  });

  it('#duplicate should delegate task to ClipBoardService', () => {
    const spy = spyOn<any>(ClipboardService, 'duplicate').and.callFake(() => undefined);
    component.duplicate();
    expect(spy).toHaveBeenCalled();
  });

  it('#delete should delegate task to Transform class', () => {
    const spy = spyOn<any>(Transform, 'delete').and.callFake(() => undefined);
    component.delete();
    expect(spy).toHaveBeenCalled();
  });
});
