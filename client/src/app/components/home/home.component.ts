import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  options: object[] =
    [
      {description : 'Creer un nouveau dessin', optionPath : '/dessin' , show : true},
      {description : 'Ouvrir la Galerie de dessins', optionPath: '/', show : true} ,
      {description : 'Afficher le guide d\'Utilisation', optionPath: '/guide/bienvenue', show : true} ,
      {description : 'Continuer un dessin', show : false}
    ];
}
