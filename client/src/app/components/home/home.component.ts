import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserGuideComponent } from '../user-guide/user-guide.component';

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
  messageAccueil = 'Bienvenue a PolyDessin';
  messageDescriptif = "A tout dessin un artiste, et cet artiste, c'est vous!";

constructor(
  public dialog: MatDialog
  ) {}

  openDialog(): void {
    this.dialog.open(UserGuideComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

}
