import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveServerComponent } from './save-server.component';

describe('SaveServerComponent', () => {
  let component: SaveServerComponent;
  let fixture: ComponentFixture<SaveServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
