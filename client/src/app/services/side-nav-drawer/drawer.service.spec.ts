import { TestBed } from '@angular/core/testing';

import { DrawerService } from './drawer.service';
import { Tools } from 'src/app/enums/tools';

describe('DrawerService', () => {

  let service: DrawerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      
    });
    service = TestBed.get(DrawerService);
  });

  it('should be created', () => { 
    expect(service).toBeTruthy();
  });

  it('should be opened by default', () => { 
    expect(service.navIsOpened).toBe(true);
  });

  it('should be able to change status', () => { 
    service.navIsOpened = false;
    service.updateDrawer(Tools.Line);
    expect(service.navIsOpened).toBe(true);
  });

  it('should be able to close', () => { 
    service.lastTool = Tools.Line;
    service.updateDrawer(Tools.Line);
    expect(service.navIsOpened).toBe(false);
  });

  it('should change last tool', () => { 
    service.lastTool = Tools.Line;
    service.updateDrawer(Tools.Pencil);
    expect(service.lastTool).toEqual(Tools.Pencil);
  });
});
