import {NgModule} from '@angular/core';
import {Routes, RouterModule } from '@angular/router';
import {UserGuideComponent} from '../user-guide/user-guide.component';
import { BienvenueGuideComponent } from '../guideTemplaates/bienvenue-guide/bienvenue-guide.component';
import { LigneGuideComponent } from '../guideTemplaates/ligne-guide/ligne-guide.component';
import { PinceauGuideComponent } from '../guideTemplaates/pinceau-guide/pinceau-guide.component';
import { CrayonGuideComponent } from '../guideTemplaates/crayon-guide/crayon-guide.component';
import { RectangleGuideComponent } from '../guideTemplaates/rectangle-guide/rectangle-guide.component';
import { CouleurGuideComponent } from '../guideTemplaates/couleur-guide/couleur-guide.component';

const routes: Routes = [
  {path : 'userGuide', component : UserGuideComponent},
  {path : 'userGuide/Bienvenue', component : BienvenueGuideComponent},
  {path : 'userGuide/Ligne' , component : LigneGuideComponent},
  {path : 'userGuide/Pinceau' , component : PinceauGuideComponent },
  {path : 'userGuide/Crayon', component : CrayonGuideComponent},
  {path : 'userGuide/Rectangle', component : RectangleGuideComponent},
  {path : 'userGuide/Couleur', component : CouleurGuideComponent}
]
@NgModule({
  imports : [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}
export const routingComponents = [UserGuideComponent,BienvenueGuideComponent,
  LigneGuideComponent, PinceauGuideComponent, CrayonGuideComponent,RectangleGuideComponent,CouleurGuideComponent]
