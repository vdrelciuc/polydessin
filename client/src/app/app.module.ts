import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { OptionPannelComponent } from './components/option-pannel/option-pannel.component';

@NgModule({
    declarations: [AppComponent, WorkspaceComponent, SidebarComponent, OptionPannelComponent],
    imports: [BrowserModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
