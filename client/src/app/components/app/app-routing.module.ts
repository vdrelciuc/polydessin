import {NgModule} from '@angular/core';
import {RouterModule, Routes } from '@angular/router';
import { BienvenueGuideComponent } from '../guideTemplaates/bienvenue-guide/bienvenue-guide.component';
import { CouleurGuideComponent } from '../guideTemplaates/couleur-guide/couleur-guide.component';
import { CrayonGuideComponent } from '../guideTemplaates/crayon-guide/crayon-guide.component';
import { LigneGuideComponent } from '../guideTemplaates/ligne-guide/ligne-guide.component';
import { NouveauDessinComponent } from '../guideTemplaates/nouveau-dessin/nouveau-dessin.component';
import { PinceauGuideComponent } from '../guideTemplaates/pinceau-guide/pinceau-guide.component';
import { RectangleGuideComponent } from '../guideTemplaates/rectangle-guide/rectangle-guide.component';
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
  {path : 'couleur',  component : CouleurGuideComponent , outlet: 'guideSubCategory'},
  {path : 'nouveauDessin', component : NouveauDessinComponent , outlet: 'guideSubCategory'},
]

@NgModule({
  imports : [
    RouterModule.forRoot(routes),
    RouterModule.forChild(secondaryRoutes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}
export const RoutingComponents = [UserGuideComponent, BienvenueGuideComponent,
  LigneGuideComponent, PinceauGuideComponent, CrayonGuideComponent,
  RectangleGuideComponent, CouleurGuideComponent, NouveauDessinComponent, WorkingAreaComponent];
