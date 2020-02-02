import { Injectable } from '@angular/core';
//import { ElementRef, Injectable, Renderer2 } from '@angular/core';
//import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { DrawableService } from '../drawable.service';

@Injectable({
  providedIn: 'root'
})
export abstract class ShapeService extends DrawableService {

  constructor() {
    super();
  }
}
