import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './components/app/app.component';
import { LineComponent } from './components/line/line.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { OptionPannelComponent } from './components/option-pannel/option-pannel.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { AngularMaterialModule } from './modules/angular-material.module';
import { DrawablePropertiesService } from './services/index/drawable/properties/drawable-properties.service';
import { PencilComponent } from './components/pencil/pencil.component';
import { HomeComponent } from './components/home/home.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {AppRoutingModule, RoutingComponents} from './components/app/app-routing.module';
import { PinceauGuideComponent } from './components/guideTemplaates/pinceau-guide/pinceau-guide.component';
import { CrayonGuideComponent } from './components/guideTemplaates/crayon-guide/crayon-guide.component';
import { LigneGuideComponent } from './components/guideTemplaates/ligne-guide/ligne-guide.component';
import { RectangleGuideComponent } from './components/guideTemplaates/rectangle-guide/rectangle-guide.component';
import { CouleurGuideComponent } from './components/guideTemplaates/couleur-guide/couleur-guide.component';
import { NouveauDessinComponent } from './components/guideTemplaates/nouveau-dessin/nouveau-dessin.component';
import { UserGuideComponent } from './components/user-guide/user-guide.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    OptionPannelComponent,
    SidebarComponent,
    LineComponent,
    WorkspaceComponent,
    PencilComponent,
    HomeComponent,
    PinceauGuideComponent,
    CrayonGuideComponent,
    LigneGuideComponent,
    RectangleGuideComponent,
    CouleurGuideComponent,
    NouveauDessinComponent,
    UserGuideComponent,
    RoutingComponents
  ],
  imports: [
    AngularMaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    AngularMaterialModule,
    AppRoutingModule,
    MatListModule,
    MatExpansionModule

  ],
  providers: [DrawablePropertiesService],
  bootstrap: [AppComponent],
})
export class AppModule {}
