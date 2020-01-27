import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import {AppRoutingModule, routingComponents} from './components/app/app-routing.module';
import { PinceauGuideComponent } from './components/guideTemplaates/pinceau-guide/pinceau-guide.component';
import { CrayonGuideComponent } from './components/guideTemplaates/crayon-guide/crayon-guide.component';
import { LigneGuideComponent } from './components/guideTemplaates/ligne-guide/ligne-guide.component';
import { RectangleGuideComponent } from './components/guideTemplaates/rectangle-guide/rectangle-guide.component';
import { CouleurGuideComponent } from './components/guideTemplaates/couleur-guide/couleur-guide.component';

@NgModule({
    declarations: [AppComponent, HomeComponent, routingComponents, PinceauGuideComponent, CrayonGuideComponent, LigneGuideComponent, RectangleGuideComponent, CouleurGuideComponent],
    imports: [BrowserModule, HttpClientModule, MatExpansionModule, BrowserAnimationsModule, MatListModule
    , AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

