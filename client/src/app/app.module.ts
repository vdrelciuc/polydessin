import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {AppRoutingModule, RoutingComponents} from './components/app/app-routing.module';
import { AppComponent } from './components/app/app.component';
import { BrushComponent } from './components/brush/brush.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ColorPaletteComponent } from './components/color-palette/color-palette.component';
import { ColorPanelComponent } from './components/color-panel/color-panel.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ColorSliderComponent } from './components/color-slider/color-slider.component';
import { CreateNewComponent } from './components/create-new/create-new.component';
import { WarningDialogComponent } from './components/create-new/warning-dialog/warning-dialog.component';
import { ExportComponent } from './components/export/export.component';
import { CouleurGuideComponent } from './components/guideTemplaates/couleur-guide/couleur-guide.component';
import { CrayonGuideComponent } from './components/guideTemplaates/crayon-guide/crayon-guide.component';
import { LigneGuideComponent } from './components/guideTemplaates/ligne-guide/ligne-guide.component';
import { NouveauDessinComponent } from './components/guideTemplaates/nouveau-dessin/nouveau-dessin.component';
import { PinceauGuideComponent } from './components/guideTemplaates/pinceau-guide/pinceau-guide.component';
import { RectangleGuideComponent } from './components/guideTemplaates/rectangle-guide/rectangle-guide.component';
import { HomeComponent } from './components/home/home.component';
import { LineComponent } from './components/line/line.component';
import { OptionPannelComponent } from './components/option-pannel/option-pannel.component';
import { PencilComponent } from './components/pencil/pencil.component';
import { PolygonComponent } from './components/polygon/polygon.component';
import { RectangleComponent } from './components/rectangle/rectangle.component';
import { SelectionComponent } from './components/selection/selection.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserGuideComponent } from './components/user-guide/user-guide.component';
import { WorkingAreaComponent } from './components/working-area/working-area.component';
import { ResizeObserverDirective } from './components/workspace/resize-observer.directive';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { AngularMaterialModule } from './modules/angular-material.module';
import { DrawablePropertiesService } from './services/index/drawable/properties/drawable-properties.service';
import { EllipseComponent } from './components/ellipse/ellipse.component';
import { EraserComponent } from './components/eraser/eraser.component';
import { PipetteComponent } from './components/pipette/pipette.component';
import { SaveServerComponent } from './components/save-server/save-server.component';
import { ErrorOnSaveComponent } from './components/save-server/error-on-save/error-on-save.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    EraserComponent,
    OptionPannelComponent,
    SidebarComponent,
    LineComponent,
    WorkspaceComponent,
    PencilComponent,
    RectangleComponent,
    BrushComponent,
    HomeComponent,
    PinceauGuideComponent,
    CrayonGuideComponent,
    LigneGuideComponent,
    RectangleGuideComponent,
    CouleurGuideComponent,
    NouveauDessinComponent,
    UserGuideComponent,
    CreateNewComponent,
    WorkingAreaComponent,
    ColorPanelComponent,
    ColorPickerComponent,
    ColorPaletteComponent,
    ColorSliderComponent,
    RoutingComponents,
    ResizeObserverDirective,
    WarningDialogComponent,
    ExportComponent,

    PolygonComponent,
    EllipseComponent,
    EraserComponent,
    SelectionComponent,
    PolygonComponent,
    ExportComponent,
    PipetteComponent,
    SaveServerComponent,
    ErrorOnSaveComponent
  ],
  entryComponents: [
    ColorPickerComponent,
    CreateNewComponent,
    SaveServerComponent,
    ErrorOnSaveComponent,
    WarningDialogComponent,
    UserGuideComponent,
    ExportComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AngularMaterialModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    AppRoutingModule,
    MatListModule,
    MatExpansionModule,
    RouterModule
  ],
  providers: [DrawablePropertiesService],
  bootstrap: [AppComponent],
})
export class AppModule {}
