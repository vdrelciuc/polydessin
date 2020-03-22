import { TestBed } from '@angular/core/testing';

import { WorkingAreaComponent } from 'src/app/components/working-area/working-area.component';
import { Tools } from 'src/app/enums/tools';
import { ShortcutManagerService } from '../shortcut-manager/shortcut-manager.service';

describe('ShortcutManagerService', () => {

  let service: ShortcutManagerService;
  const numberOfSubscription = 29;
  const numberOfDefaultToPrevent = 4;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ShortcutManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#saveCurrentTool should save current tool, and set tool to none', () => {
    service.toolSelectorService.$currentTool.next(Tools.Brush);
    service.saveCurrentTool();
    expect(service['savedTool']).toEqual(Tools.Brush);
    expect(service.toolSelectorService.$currentTool.value).toEqual(Tools.None);
  });

  it('#loadSavedTool should load saved tool to current tool', () => {
    service.toolSelectorService.$currentTool.next(Tools.Brush);
    service['savedTool'] = Tools.Line;
    service.loadSavedTool();
    expect(service.toolSelectorService.$currentTool.value).toEqual(Tools.Line);
  });

  it('#setWorkingAreaComponent should set working area', () => {
    expect(service['workingAreaComponent']).toEqual(undefined as unknown as WorkingAreaComponent);
    const mockedWorkingArea = {
      route: 'mocked'
    } as unknown as WorkingAreaComponent;
    service.setWorkingAreaComponent(mockedWorkingArea);
    expect(service['workingAreaComponent']).toEqual(mockedWorkingArea);
  });

  it('#disableShortcuts should disable shortcuts and prevent default', () => {
    service.setupShortcuts();
    expect(service['subscriptions'].length).toEqual(numberOfSubscription);
    service.disableShortcuts();
    expect(service['subscriptions'].length).toEqual(numberOfDefaultToPrevent);
  });

  it('#setupShortcuts should setup shortcuts', () => {
    service.setupShortcuts();
    const spy = spyOn(service['toolSelectorService'], 'setCurrentTool');
    const keys = ['l', 'c', '1', 'w', 'control.o'];
    for (const element of keys) {
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: element,
        bubbles: true
      }));
    }
    // tslint:disable-next-line: no-magic-numbers | Reason : there are currently 4 shortcuts
    expect(spy).toHaveBeenCalledTimes(4);
    expect(service['subscriptions'].length).toEqual(numberOfSubscription);
  });
});
