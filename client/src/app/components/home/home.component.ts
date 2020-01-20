import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  options: object[] =
    [
      {description :'Creer un nouveau dessin', show : true},
      {description :'Ouvrir la Galerie de dessins', show : true} ,
      {description :"Afficher le guide d'Utilisation ", show : true} ,
      {description :'Continuer un dessin', show : false}
      ];
  messageAccueil : string = "Bienvenue a SketchPad Clone";
  messageDescriptif : string = "A tout dessin un artiste, et cet artiste, c'est vous!";
  constructor() { }

  ngOnInit() {
  }

}
