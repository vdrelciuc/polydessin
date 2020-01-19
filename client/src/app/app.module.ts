import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { WorkspaceService } from './services/workspace.service';

@NgModule({
    declarations: [AppComponent, WorkspaceComponent, SidebarComponent, CanvasComponent],
    imports: [BrowserModule, HttpClientModule],
    providers: [WorkspaceService],
    bootstrap: [AppComponent],
})
export class AppModule {}
