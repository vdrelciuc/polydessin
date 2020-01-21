import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { UserGuideComponent } from './components/user-guide/user-guide.component';

@NgModule({
    declarations: [AppComponent, HomeComponent, UserGuideComponent],
    imports: [BrowserModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
