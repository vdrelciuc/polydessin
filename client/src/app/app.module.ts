import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import {AppRoutingModule, routingComponents} from './components/app/app-routing.module';

@NgModule({
    declarations: [AppComponent, HomeComponent, routingComponents],
    imports: [BrowserModule, HttpClientModule, MatExpansionModule, BrowserAnimationsModule, MatListModule
    , AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
