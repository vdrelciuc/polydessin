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

@NgModule({
    declarations: [
      AppComponent,
      LineComponent
    ],
    imports: [
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
