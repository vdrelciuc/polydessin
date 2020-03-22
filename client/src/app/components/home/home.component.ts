import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { UserGuideComponent } from '../user-guide/user-guide.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @ViewChild('createNewBtn', { static: true }) createNewBtn: ElementRef<HTMLAnchorElement>;
  @ViewChild('openGalleryBtn', { static: true }) openGalleryBtn: ElementRef<HTMLAnchorElement>;

  private subscriptions: Subscription[] = [];
  options: object[] =
    [
      {description : 'Creer un nouveau dessin', optionPath : '/dessin' , show : true},
      {description : 'Ouvrir la Galerie de dessins', optionPath: '/', show : true} ,
      {description : 'Afficher le guide d\'Utilisation', optionPath: '/guide/bienvenue', show : true} ,
      {description : 'Continuer un dessin', show : false}
    ];
  readonly messageAccueil: string = 'Bienvenue a PolyDessin';
  readonly messageDescriptif: string = "A tout dessin un artiste, et cet artiste, c'est vous!";

constructor(
  private shortcut: HotkeysService,
  private shortcutManager: ShortcutManagerService,
  public dialog: MatDialog
  ) {
    this.shortcutManager.disableShortcuts();
    this.setupShortcuts();
  }

  openDialog(): void {
    this.dialog.open(UserGuideComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

  private setupShortcuts(): void {
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.o', description: 'Opening create a new drawing' }).subscribe(
      (event) => {
        this.createNewBtn.nativeElement.click();
        this.subscriptions.forEach ( (subscription) => subscription.unsubscribe() );
      }
    )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.g', description: 'Opening gallery' }).subscribe(
      (event) => {
        this.openGalleryBtn.nativeElement.click();
        this.subscriptions.forEach ( (subscription) => subscription.unsubscribe() );
      }
    )
    );
  }
}
