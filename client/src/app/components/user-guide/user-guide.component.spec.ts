import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { APP_BASE_HREF } from '@angular/common';
import { MatAccordion, MatDialogRef, MatExpansionModule, MatListModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { UserGuideComponent } from './user-guide.component';

describe('UserGuideComponent', () => {
  let component: UserGuideComponent;
  let fixture: ComponentFixture<UserGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserGuideComponent ],
      providers: [
        MatAccordion,
        {
          provide: MatDialogRef,
          useValue: {
            moduleDef: UserGuideComponent,
            close: () => null,
          }
        },
        {provide: APP_BASE_HREF, useValue : '/' }
      ],
      imports: [
        BrowserAnimationsModule,
        MatListModule,
        MatExpansionModule,
        RouterModule.forRoot(
          [{
            path : '' , component : UserGuideComponent
          }]

        )
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(UserGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    history.pushState({
      path: 'test'
    }, 'mockState');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should update previous module', () => {
    component.ngOnInit();
    expect(component.previousModuleRoute).toEqual('test');
  });

  it('#getCurrentSubCategorie should return current sub ', () => {
    const mocked = 'mocked';
    component['currentSubCategorie'] = mocked;
    expect(component.getCurrentSubCategorie()).toEqual(mocked);
  });

  it('#findIndex should return index of invalid param', () => {
    expect(component.findIndex('mocked')).toEqual([0, 0, true]);
  });

  it('#findIndex should return index of valid param', () => {
    expect(component.findIndex('Pinceau')).toEqual([1, 0, false]);
  });

  it('#findIndex should return index of valid param last element', () => {
    expect(component.findIndex('Couleur')).toEqual([1, 2, true]);
  });

  it('#getNextElement should return next element', () => {
    component['currentSubCategorie'] = 'Pinceau';
    expect(component.getNextElement()).toEqual('Crayon');
  });

  it('#getNextElement should return next element in another section', () => {
    component['currentSubCategorie'] = 'Couleur';
    expect(component.getNextElement()).toEqual('Ligne');
  });

  it('#getNextElement should not return next element', () => {
    component['currentSubCategorie'] = 'Nouveau Dessin';
    expect(component.getNextElement()).toEqual('Nouveau Dessin');
  });

  it('#getPreviousElement should return previous element', () => {
    component['currentSubCategorie'] = 'Crayon';
    expect(component.getPreviousElement()).toEqual('Pinceau');
  });

  it('#getPreviousElement should return previous element in another section', () => {
    component['currentSubCategorie'] = 'Pinceau';
    expect(component.getPreviousElement()).toEqual('Bienvenue');
  });

  it('#getPreviousElement should not return previous element', () => {
    component['currentSubCategorie'] = 'Bienvenue';
    expect(component.getPreviousElement()).toEqual('Bienvenue');
  });

  it('#closeGuide should close', () => {
    const spy = spyOn(component.dialogRef, 'close');
    const spy2 = spyOn(component['router'], 'navigate');
    component.closeGuide();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});
