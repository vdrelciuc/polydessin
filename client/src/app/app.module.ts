import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { UserGuideComponent } from './components/user-guide/user-guide.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';

@NgModule({
    declarations: [AppComponent, HomeComponent, UserGuideComponent],
    imports: [BrowserModule, HttpClientModule, MatExpansionModule, BrowserAnimationsModule, MatListModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
