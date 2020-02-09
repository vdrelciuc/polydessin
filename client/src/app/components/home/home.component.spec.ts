import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
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
        {description : 'Afficher le guide d\'Utilisation', optionPath: '/userGuide/bienvenue', show : true} ,
        {description : 'Continuer un dessin', show : false}
      ];

    expect(component.options).toEqual(options);
  });
});
