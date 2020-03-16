import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UserGuideComponent } from '../user-guide/user-guide.component';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private subscriptions: Subscription[] = [];
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
  private shortcut: HotkeysService,
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

  setupShortcuts(): void {
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.o', description: 'Opening create a new drawing' }).subscribe(
      (event) => {
        // link to create new window
      }
    )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.g', description: 'Opening gallery' }).subscribe(
      (event) => {
        // link to open gallery window
      }
    )
    );
  }
}
