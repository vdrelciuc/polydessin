import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextComponent } from './text.component';
import { MatSliderModule, MatOptionModule, MatSliderChange, MatRadioChange } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TextService } from 'src/app/services/index/drawable/text/text.service';
import { Alignment } from 'src/app/enums/text-alignement';
import { CharacterFont } from 'src/app/enums/character-font';
import { DEFAULT_TEXT_SIZE } from 'src/app/classes/constants';

describe('TextComponent', () => {
  let component: TextComponent;
  let fixture: ComponentFixture<TextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextComponent ],
      imports: [
        MatSliderModule,
        MatOptionModule,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(TextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component['service'] = new TextService();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should setup text shortcuts and disable all others', () => {
    const spy = spyOn(component['shortcutManager'], 'disableShortcuts');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component['subscriptions'].length).toEqual(6);
  });

  it('#ngOnDestroy should setup shortcuts and disable text shortcuts', () => {
    const spy = spyOn(component['shortcutManager'], 'setupShortcuts');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(component['subscriptions'].length).toEqual(0);
  });

  it('#setSize should set valid new size', () => {
    const testValue = 10;
    component.setSize({value: testValue} as unknown as MatSliderChange);
    expect(component['service'].properties.value.size).toEqual(testValue);
  });

  it('#setSize should not set invalid size', () => {
    component.setSize({value: null} as unknown as MatSliderChange);
    expect(component['service'].properties.value.size).toEqual(DEFAULT_TEXT_SIZE);
  });

  it('#updateBold should toggle bold', () => {
    component.updateBold()
    expect(component['service'].properties.value.isBold).toEqual(true);
    component.updateBold()
    expect(component['service'].properties.value.isBold).toEqual(false);
  });

  it('#updateBold should toggle italic', () => {
    component.updateItalic()
    expect(component['service'].properties.value.isItalic).toEqual(true);
    component.updateItalic()
    expect(component['service'].properties.value.isItalic).toEqual(false);
  });

  it('#setFont should set valid new font', () => {
    component.setFont({target: {value: CharacterFont.SS}} as unknown as Event);
    expect(component['service'].properties.value.font).toEqual(CharacterFont.SS);
  });

  it('#setFont should not set invalid font', () => {
    component.setFont({target: {value: undefined}} as unknown as Event);
    expect(component['service'].properties.value.font).toEqual(CharacterFont.Ubuntu);
  });

  it('#setAlignement should set valid new alignment', () => {
    component.setAlignement({value: Alignment.Right} as unknown as MatRadioChange);
    expect(component['service'].properties.value.alignment).toEqual(Alignment.Right);
  });

  it('#setAlignement should not set invalid alignment', () => {
    component.setAlignement({value: undefined} as unknown as MatRadioChange);
    expect(component['service'].properties.value.alignment).toEqual(Alignment.Left);
  });
});
