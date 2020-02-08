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
  {path : 'guide', component : UserGuideComponent,
    children : [
      {path : 'bienvenue', component : BienvenueGuideComponent},
      {path : 'ligne' , component : LigneGuideComponent},
      {path : 'pinceau' , component : PinceauGuideComponent },
      {path : 'crayon',  component : CrayonGuideComponent},
      {path : 'rectangle',  component : RectangleGuideComponent},
      {path : 'couleur',  component : CouleurGuideComponent},
      {path : 'nouveauDessin', component : NouveauDessinComponent}
    ]
  },
  {path : '', component : HomeComponent}
];

@NgModule({
  imports : [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
export const RoutingComponents = [UserGuideComponent, BienvenueGuideComponent,
  LigneGuideComponent, PinceauGuideComponent, CrayonGuideComponent,
  RectangleGuideComponent, CouleurGuideComponent, NouveauDessinComponent, WorkingAreaComponent];
