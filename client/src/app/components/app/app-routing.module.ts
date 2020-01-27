import {NgModule} from '@angular/core';
import {Routes, RouterModule } from '@angular/router';
import {UserGuideComponent} from '../user-guide/user-guide.component';
import { BienvenueGuideComponent } from '../guideTemplaates/bienvenue-guide/bienvenue-guide.component';

const routes: Routes = [
  {path : 'userGuide', component : UserGuideComponent},
  {path : 'userGuide/Bienvenue', component : BienvenueGuideComponent}
]
@NgModule({
  imports : [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}
export const routingComponents = [UserGuideComponent,BienvenueGuideComponent]
