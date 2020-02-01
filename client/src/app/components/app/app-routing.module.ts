import {NgModule} from '@angular/core';
import {Routes, RouterModule } from '@angular/router';
import {UserGuideComponent} from '../user-guide/user-guide.component';
import { BienvenueGuideComponent } from '../guideTemplaates/bienvenue-guide/bienvenue-guide.component';
import { LigneGuideComponent } from '../guideTemplaates/ligne-guide/ligne-guide.component';
import { PinceauGuideComponent } from '../guideTemplaates/pinceau-guide/pinceau-guide.component';
import { CrayonGuideComponent } from '../guideTemplaates/crayon-guide/crayon-guide.component';
import { RectangleGuideComponent } from '../guideTemplaates/rectangle-guide/rectangle-guide.component';
import { CouleurGuideComponent } from '../guideTemplaates/couleur-guide/couleur-guide.component';
import { NouveauDessinComponent } from '../guideTemplaates/nouveau-dessin/nouveau-dessin.component';

const routes: Routes = [
  {path : 'userGuide', component : UserGuideComponent},
  {path : 'userGuide/Bienvenue', component : BienvenueGuideComponent}
  ];

const secondaryRoutes: Routes = [
  {path : 'userGuide/Ligne' , component : LigneGuideComponent, outlet : 'guideElement'},
  {path : 'userGuide/Pinceau' , component : PinceauGuideComponent, outlet : 'guideElement' },
  {path : 'userGuide/Crayon', component : CrayonGuideComponent, outlet : 'guideElement'},
  {path : 'userGuide/Rectangle', component : RectangleGuideComponent, outlet : 'guideElement'},
  {path : 'userGuide/Couleur', component : CouleurGuideComponent, outlet : 'guideElement'},
  {path : 'userGuide/nouveauDessin', component : NouveauDessinComponent, outlet : 'guideElement'}
]
@NgModule({
  imports : [RouterModule.forRoot(routes),RouterModule.forChild(secondaryRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}
export const RoutingComponents = [UserGuideComponent,BienvenueGuideComponent,
  LigneGuideComponent, PinceauGuideComponent, CrayonGuideComponent,
  RectangleGuideComponent,CouleurGuideComponent, NouveauDessinComponent]
