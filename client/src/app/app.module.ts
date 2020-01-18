import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './components/app/app.component';
import { OptionPannelComponent } from './components/option-pannel/option-pannel.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';

import { AngularMaterialModule } from './modules/angular-material.module'

@NgModule({
    declarations: [AppComponent, WorkspaceComponent, SidebarComponent, OptionPannelComponent],
    imports: [BrowserModule, HttpClientModule, BrowserAnimationsModule, AngularMaterialModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
