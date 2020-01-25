import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './components/app/app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { OptionPannelComponent } from './components/option-pannel/option-pannel.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { AngularMaterialModule } from './modules/angular-material.module';
import { ToolSelectorService } from './services/tools/tool-selector.service';
import { WorkspaceService } from './services/workspace.service';

@NgModule({
    declarations: [AppComponent, WorkspaceComponent, SidebarComponent, CanvasComponent, OptionPannelComponent],
    imports: [BrowserModule, HttpClientModule, BrowserAnimationsModule, AngularMaterialModule],
    providers: [WorkspaceService, ToolSelectorService],
    bootstrap: [AppComponent],
})
export class AppModule {}
