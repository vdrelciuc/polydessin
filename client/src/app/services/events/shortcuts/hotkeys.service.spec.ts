import { TestBed } from '@angular/core/testing';

import { HotkeysService } from './hotkeys.service';
// import { emit } from 'cluster';

describe('HotkeysService', () => {

  let service: HotkeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(HotkeysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should create shortcut', () => {
  //   let hasBeenCalled = false;
  //   service.addShortcut({ keys: 'shift', description: 'Function description' })
  //     .subscribe( (event) => hasBeenCalled = true );
  //   emit('keypressed', {shiftKey: true, key:'shift'});
  //   expect(hasBeenCalled).toBe(true);
  // });

  // it('should change shortcut', () => {
  //   let secondShiftCalled: boolean = false;
  //   // const button: HTMLButtonElement;
  //   service.addShortcut({keys: 'shift', description: 'Function description' })
  //     .subscribe( (event) => {
  //       secondShiftCalled = false;
  //     });
  //   service.addShortcut({keys: 'shift', description: 'Function Changed' })
  //     .subscribe( (event) => {
  //       secondShiftCalled = true;
  //     });
  //   new KeyboardEvent("keypressed", {shiftKey: true});
  //   expect(secondShiftCalled).toBe(true);
  // });
});
