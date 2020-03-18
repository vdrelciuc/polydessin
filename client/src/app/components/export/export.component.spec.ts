import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MatGridListModule, MatRadioModule } from '@angular/material';
import { ExportComponent } from './export.component';
// import { ExportService } from 'src/app/services/export/export.service';
import { ImageFilter } from 'src/app/enums/color-filter';
import { ImageFormat } from 'src/app/enums/image-format';
import { ImageExportType } from 'src/app/enums/export-type';

describe('ExportComponent', () => {
  let component: ExportComponent;
  let fixture: ComponentFixture<ExportComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            moduleDef: ExportComponent,
            close: () => null,
          },
        },
        // ExportService,
      ],
      imports: [
        MatRadioModule,
        MatGridListModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onFormatUpdate should update valid format', () => {
    component.onFormatUpdate('JPEG');
    expect(component['exportation'].currentFormat.value).toEqual(ImageFormat.JPEG);
  });

  it('#onFormatUpdate should not update not valid format', () => {
    component['exportation'].currentFormat.next(ImageFormat.JPEG);
    component.onFormatUpdate('bla');
    expect(component['exportation'].currentFormat.value).toEqual(ImageFormat.JPEG);
  });

  it('#onFilterUpdate should update valid filter', () => {
    const spy = spyOn(component['exportation'], 'drawPreview');
    component.onFilterUpdate('Sombre');
    expect(component['exportation'].currentFilter.value).toEqual(ImageFilter.Sombre);
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('#onFilterUpdate should not update not valid filter', () => {
    component['exportation'].currentFilter.next(ImageFilter.Aucun);
    const spy = spyOn(component['exportation'], 'drawPreview');
    component.onFilterUpdate('bla' as unknown as ImageFilter);
    expect(component['exportation'].currentFilter.value).toEqual(ImageFilter.Aucun);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onExportTypeUpdate should update valid export type', () => {
    component['exportation'].currentExportType.next(ImageExportType.Téléchargement);
    expect(component['exportation'].currentExportType.value).toEqual(ImageExportType.Téléchargement);
    component.onExportTypeUpdate('Courriel');
    expect(component['exportation'].currentExportType.value).toEqual(ImageExportType.Courriel);
  });

  it('#onExportTypeUpdate should not update not valid export type', () => {
    component['exportation'].currentExportType.next(ImageExportType.Courriel);
    component.onExportTypeUpdate('bla');
    expect(component['exportation'].currentExportType.value).toEqual(ImageExportType.Courriel);
  });

  it('#onDialogClose shoud close dialog', () => {
    const spy = spyOn(component['dialogRef'], 'close');
    component.onDialogClose();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('#onDialogClose shoud close dialog and export', () => {
    component['title'] = 'title';
    const spy = spyOn(component['dialogRef'], 'close');
    const spy2 = spyOn(component['exportation'], 'export');
    component.exportConfirmation();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith('title');
  });

  it('#onTitleUpdate shoud validate title', () => {
    const spy = spyOn(component['exportation'], 'validateTitle');
    component.onTitleUpdate(
      {
        target: {
          value: 'titletest'
        } as HTMLInputElement
      } as unknown as KeyboardEvent
    );
    expect(spy).toHaveBeenCalledWith('titletest');
  });

  it('#onTitleUpdate shoud not validate title, target is null', () => {
    const spy = spyOn(component['exportation'], 'validateTitle');
    component.onTitleUpdate(
      {
        target: null
      } as unknown as KeyboardEvent
    );
    expect(spy).not.toHaveBeenCalled();
  });
});
