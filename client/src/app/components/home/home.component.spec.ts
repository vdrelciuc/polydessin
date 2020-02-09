import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { MatDialog } from '@angular/material';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [ 
        {
          provide: MatDialog,
          useValue: {
            open: () => null,
            closeAll: () => null,
          }
        }
       ], 
      imports: [
        RouterModule.forRoot(
          [{
            path : '' , component : HomeComponent
          }]

        )
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create and correctly initialize the options attribute', () => {
    const options: object[] =
      [
        {description : 'Creer un nouveau dessin', optionPath : '/dessin' , show : true},
        {description : 'Ouvrir la Galerie de dessins', optionPath: '/', show : true} ,
        {description : 'Afficher le guide d\'Utilisation', optionPath: '/guide/bienvenue', show : true} ,
        {description : 'Continuer un dessin', show : false}
      ];

    expect(component.options).toEqual(options);
  });

  it('#openDialog should open a new dialog', () => {
    const spy = spyOn(component['dialog'], 'open');
    component.openDialog();
    expect(spy).toHaveBeenCalled();
  });
});
