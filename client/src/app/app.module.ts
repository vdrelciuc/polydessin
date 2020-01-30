import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { CreateNewComponent } from './components/create-new/create-new.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@NgModule({
    declarations: [AppComponent, CreateNewComponent],
    imports: [BrowserModule, HttpClientModule, MatSliderModule, MatFormFieldModule, MatInputModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
