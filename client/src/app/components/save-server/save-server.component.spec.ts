import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveServerComponent } from './save-server.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MatSnackBarModule, MatDialogModule, MatDialog, MatSnackBar } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { ErrorOnSaveComponent } from './error-on-save/error-on-save.component';
import { SaveServerService } from 'src/app/services/saveServer/save-server.service';
import { ExportService } from 'src/app/services/export/export.service';
import { REGEX_TITLE } from 'src/app/classes/regular-expressions';

describe('SaveServerComponent', () => {
  let component: SaveServerComponent;
  let fixture: ComponentFixture<SaveServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveServerComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            moduleDef: SaveServerComponent,
            close: () => null,
          },
        },
        MatSnackBar,
        {
          provide: MatDialog,
          useValue: () => ({
            open: () => ({
              componentInstance: {
                errorTitle: 'bla',
              },
            })
          }),
        },
        SaveServerService,
        ExportService
      ],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatDialogModule,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SaveServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onDialogClose should close dialog', () => {
    const spy = spyOn(component['dialogRef'], 'close');
    component.onDialogClose();
    expect(spy).toHaveBeenCalled();
  });

  it('#saveConfirmation should alert for invalid title', async () => {
    component['isValidTitle'] = false;
    component['dialog'] = {
      open: () => ({
        componentInstance: {
          errorTitle: true
        }
      })
    } as unknown as MatDialog;
    const spy = spyOn(component['dialog'], 'open');
    await component.saveConfirmation();
    expect(spy).toHaveBeenCalledWith(ErrorOnSaveComponent, {disableClose: true});
  });

  it('#saveConfirmation should save', async () => {
    component['isValidTitle'] = true;
    component['isSaving'] = true;
    const spy = spyOn(component['dialog'], 'open');
    const spy2 = spyOn(component['snacks'], 'open');
    await component.saveConfirmation();
    expect(spy).not.toHaveBeenCalledWith(ErrorOnSaveComponent, {disableClose: true});
    expect(spy2).toHaveBeenCalledWith('Début de la sauvegarde', '', {duration : 1400} );
  });

  it('#addTag should show error, max number of tags reached', () => {
    let tags = new Set<string>();
    tags.add('test1');
    tags.add('test2');
    tags.add('test3');
    tags.add('test4');
    tags.add('test5');
    component['tags'] = tags;
    const spy = spyOn(component['snacks'], 'open');
    component.addTag('test6');
    expect(spy).toHaveBeenCalledWith('Vous ne pouvez pas ajouter plus de 5 étiquettes', '', {duration: 2000});
  });

  it('#addTag should show error, tag name invalid', () => {
    const spy = spyOn(component['snacks'], 'open');
    component.addTag('!!!!');
    expect(component['tags'].has('!!!!')).toEqual(false);
    expect(spy).toHaveBeenCalledWith('Étiquette invalide', '', {duration: 2000});
  });

  it('#addTag should add valid tag', () => {
    const spy = spyOn(component['snacks'], 'open');
    component.addTag('valid');
    expect(component['tags'].has('VALID')).toEqual(true);
    expect(component['tagName']).toEqual('');
    expect(spy).not.toHaveBeenCalled();
  });

  it('#removeTage should remove a tag', () => {
    const spy = spyOn(component['saveService'], 'removeTag');
    const tags = component['tags'];
    component.removeTag('test');
    expect(spy).toHaveBeenCalledWith('test', tags)
  });

  it('#checkTitleValidity should return invalid title', () => {
    const spy = spyOn(component['saveService'], 'checkTitleValidity').and.callFake(function(title: string) {
      return REGEX_TITLE.test(title);
    });;
    const ret = component.checkTitleValidity('1');
    expect(spy).toHaveBeenCalledWith('1');
    expect(ret).toEqual(false);
  });

  it('#checkTitleValidity should return valid title', () => {
    const spy = spyOn(component['saveService'], 'checkTitleValidity').and.callFake(function(title: string) {
      return REGEX_TITLE.test(title);
    });
    const ret = component.checkTitleValidity('test');
    expect(spy).toHaveBeenCalledWith('test');
    expect(ret).toEqual(true);
  });
});
