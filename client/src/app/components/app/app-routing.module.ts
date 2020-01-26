import {NgModule} from '@angular/core';
import {Routes, RouterModule } from '@angular/router';
import {UserGuideComponent} from '../user-guide/user-guide.component';

const routes: Routes = [
  {path : 'userGuide', component : UserGuideComponent}
]
@NgModule({
  imports : [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}
export const routingComponents = [UserGuideComponent]
