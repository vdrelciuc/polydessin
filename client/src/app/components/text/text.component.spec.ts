import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatOptionModule, MatRadioChange, MatSliderChange, MatSliderModule } from '@angular/material';
import { DEFAULT_TEXT_SIZE } from 'src/app/classes/constants';
import { CharacterFont } from 'src/app/enums/character-font';
import { Alignment } from 'src/app/enums/text-alignement';
import { TextService } from 'src/app/services/drawable/text/text.service';
import { TextComponent } from './text.component';

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
    // tslint:disable-next-line: no-magic-numbers | Reason: default value, used for testing purposes
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
    component.updateBold();
    expect(component['service'].properties.value.isBold).toEqual(true);
    component.updateBold();
    expect(component['service'].properties.value.isBold).toEqual(false);
  });

  it('#updateBold should toggle italic', () => {
    component.updateItalic();
    expect(component['service'].properties.value.isItalic).toEqual(true);
    component.updateItalic();
    expect(component['service'].properties.value.isItalic).toEqual(false);
  });

  it('#setFont should set valid new font', () => {
    component.setFont({target: {value: CharacterFont.Mono}} as unknown as Event);
    expect(component['service'].properties.value.font).toEqual(CharacterFont.Mono);
  });

  it('#setFont should not set invalid font', () => {
    component.setFont({target: {value: undefined}} as unknown as Event);
    expect(component['service'].properties.value.font).toEqual(CharacterFont.C);
  });

  it('#setAlignement should set valid new alignment', () => {
    component.setAlignement({value: Alignment.Right} as unknown as MatRadioChange);
    expect(component['service'].properties.value.alignment).toEqual(Alignment.Right);
  });

  it('#setAlignement should not set invalid alignment value', () => {
    component.setAlignement({value: null} as unknown as MatRadioChange);
    expect(component['service'].properties.value.alignment).toEqual(Alignment.Left);
  });

  it('#setupShortcuts should move left', () => {
    const spy = spyOn(component['service'], 'moveLeft');
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'arrowleft',
      bubbles: true
    }));
    expect(spy).toHaveBeenCalled();
  });

  it('#setupShortcuts should move right', () => {
    const spy = spyOn(component['service'], 'moveRight');
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'arrowright',
      bubbles: true
    }));
    expect(spy).toHaveBeenCalled();
  });

  it('#setupShortcuts should go to new line', () => {
    const spy = spyOn(component['service'], 'createCurrentTextBox');
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'enter',
      bubbles: true
    }));
    expect(spy).toHaveBeenCalled();
  });

  it('#setupShortcuts should remove next character', () => {
    const spy = spyOn(component['service'], 'delete');
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'delete',
      bubbles: true
    }));
    expect(spy).toHaveBeenCalled();
  });

  it('#setupShortcuts should remove previous character', () => {
    const spy = spyOn(component['service'], 'backspace');
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'backspace',
      bubbles: true
    }));
    expect(spy).toHaveBeenCalled();
  });

  it('#setupShortcuts should delete current text element', () => {
    const spy = spyOn(component['service'], 'cancel');
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'escape',
      bubbles: true
    }));
    expect(spy).toHaveBeenCalled();
  });
});
