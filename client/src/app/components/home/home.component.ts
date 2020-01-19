import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  options: string[] =
    ['Creer un nouveau dessin', 'Ouvrir la Galerie de dessins', "Afficher le guide d'Utilisation ", 'Continuer un dessin'];
  constructor() { }

  ngOnInit() {
  }

}
