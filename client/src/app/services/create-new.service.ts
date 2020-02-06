import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Coords } from '../classes/coordinates';

@Injectable({
  providedIn: 'root'
})
export class CreateNewService {

  canvasSize: BehaviorSubject<Coords> = new BehaviorSubject<Coords>(new Coords(0, 0));
  constructor() { }
}
