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
import { LineComponent } from './components/app/line/line.component';
<<<<<<< HEAD
import { CanvasComponent } from './components/canvas/canvas.component';
import { OptionPannelComponent } from './components/option-pannel/option-pannel.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { AngularMaterialModule } from './modules/angular-material.module';
=======
>>>>>>> b6ae071e39bd5fc2dbbd572d56f23e9c65cb172a

@NgModule({
    declarations: [
      AppComponent,
<<<<<<< HEAD
      CanvasComponent,
      OptionPannelComponent,
      SidebarComponent,
      LineComponent,
      WorkspaceComponent
    ],
    imports: [
      AngularMaterialModule,
=======
      LineComponent
    ],
    imports: [
>>>>>>> b6ae071e39bd5fc2dbbd572d56f23e9c65cb172a
      BrowserModule,
      BrowserAnimationsModule,
      FormsModule,
      HttpClientModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatSliderModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
