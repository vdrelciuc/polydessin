import {NgModule} from '@angular/core';
import {RouterModule, Routes } from '@angular/router';
import {AerosolGuideComponent} from '../guideTemplaates/aerosol-guide/aerosol-guide.component';
import {ApplicateurCouleurGuideComponent} from '../guideTemplaates/applicateur-couleur-guide/applicateur-couleur-guide.component';
import { BienvenueGuideComponent } from '../guideTemplaates/bienvenue-guide/bienvenue-guide.component';
import {ClipboardGuideComponent} from '../guideTemplaates/clipboard-guide/clipboard-guide.component';
import { CouleurGuideComponent } from '../guideTemplaates/couleur-guide/couleur-guide.component';
import { CrayonGuideComponent } from '../guideTemplaates/crayon-guide/crayon-guide.component';
import {EllipseGuideComponent} from '../guideTemplaates/ellipse-guide/ellipse-guide.component';
import {ExportGuideComponent} from '../guideTemplaates/export-guide/export-guide.component';
import {GalleryGuideComponent} from '../guideTemplaates/gallery-guide/gallery-guide.component';
import {GridGuideComponent} from '../guideTemplaates/grid-guide/grid-guide.component';
import { LigneGuideComponent } from '../guideTemplaates/ligne-guide/ligne-guide.component';
import {MailGuideComponent} from '../guideTemplaates/mail-guide/mail-guide.component';
import { NouveauDessinComponent } from '../guideTemplaates/nouveau-dessin/nouveau-dessin.component';
import { PinceauGuideComponent } from '../guideTemplaates/pinceau-guide/pinceau-guide.component';
import {PipetteGuideComponent} from '../guideTemplaates/pipette-guide/pipette-guide.component';
import {PlumeGuideComponent} from '../guideTemplaates/plume-guide/plume-guide.component';
import {PolygoneGuideComponent} from '../guideTemplaates/polygone-guide/polygone-guide.component';
import { RectangleGuideComponent } from '../guideTemplaates/rectangle-guide/rectangle-guide.component';
import {RotationGuideComponent} from '../guideTemplaates/rotation-guide/rotation-guide.component';
import {SaveContinueGuideComponent} from '../guideTemplaates/save-continue-guide/save-continue-guide.component';
import {SaveServerGuideComponent} from '../guideTemplaates/save-server-guide/save-server-guide.component';
import {SceauGuideComponent} from '../guideTemplaates/sceau-guide/sceau-guide.component';
import {SelectionDeplacementGuideComponent} from '../guideTemplaates/selection-deplacement-guide/selection-deplacement-guide.component';
import {TextGuideComponent} from '../guideTemplaates/text-guide/text-guide.component';
import {UndoRedoComponent} from '../guideTemplaates/undo-redo/undo-redo.component';
import { HomeComponent } from '../home/home.component';
import {UserGuideComponent} from '../user-guide/user-guide.component';
import { WorkingAreaComponent } from '../working-area/working-area.component';

const routes: Routes = [
  {path : 'dessin' , component : WorkingAreaComponent},
  {path : '', component : HomeComponent}
];

const secondaryRoutes: Routes = [
  {path : 'bienvenue', component : BienvenueGuideComponent , outlet: 'guideSubCategory'},
  {path : 'ligne' , component : LigneGuideComponent , outlet: 'guideSubCategory'},
  {path : 'pinceau' , component : PinceauGuideComponent  , outlet: 'guideSubCategory'},
  {path : 'crayon',  component : CrayonGuideComponent , outlet: 'guideSubCategory'},
  {path : 'rectangle',  component : RectangleGuideComponent , outlet: 'guideSubCategory'},
  {path : 'polygone',  component : PolygoneGuideComponent , outlet: 'guideSubCategory'},
  {path : 'ellipse',  component : EllipseGuideComponent , outlet: 'guideSubCategory'},
  {path : 'aerosol',  component : AerosolGuideComponent , outlet: 'guideSubCategory'},
  {path : 'couleur',  component : CouleurGuideComponent , outlet: 'guideSubCategory'},
  {path : 'nouveauDessin', component : NouveauDessinComponent , outlet: 'guideSubCategory'},
  {path : 'applyer', component : ApplicateurCouleurGuideComponent , outlet: 'guideSubCategory'},
  {path : 'export', component : ExportGuideComponent , outlet: 'guideSubCategory'},
  {path : 'saveServer', component : SaveServerGuideComponent , outlet: 'guideSubCategory'},
  {path : 'gallery', component : GalleryGuideComponent , outlet: 'guideSubCategory'},
  {path : 'pipette', component : PipetteGuideComponent , outlet: 'guideSubCategory'},
  {path : 'grid', component : GridGuideComponent , outlet: 'guideSubCategory'},
  {path : 'selection', component : SelectionDeplacementGuideComponent , outlet: 'guideSubCategory'},
  {path : 'undo', component : UndoRedoComponent , outlet: 'guideSubCategory'},
  {path : 'autoSave', component : SaveContinueGuideComponent , outlet: 'guideSubCategory'},
  {path : 'rotation', component : RotationGuideComponent , outlet: 'guideSubCategory'},
  {path : 'clipboard', component : ClipboardGuideComponent , outlet: 'guideSubCategory'},
  {path : 'text', component : TextGuideComponent , outlet: 'guideSubCategory'},
  {path : 'feather', component : PlumeGuideComponent , outlet: 'guideSubCategory'},
  {path : 'sceau', component : SceauGuideComponent , outlet: 'guideSubCategory'},
  {path : 'mail', component : MailGuideComponent , outlet: 'guideSubCategory'}
];

@NgModule({
  imports : [
    RouterModule.forRoot(routes),
    RouterModule.forChild(secondaryRoutes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}
// tslint:disable-next-line: variable-name | Reason : a component name starts with capital
export const RoutingComponents = [UserGuideComponent, BienvenueGuideComponent,
  LigneGuideComponent, PinceauGuideComponent, CrayonGuideComponent,
  RectangleGuideComponent, CouleurGuideComponent, NouveauDessinComponent, WorkingAreaComponent];
