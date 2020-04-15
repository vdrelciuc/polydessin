import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CoordinatesXY } from '../../classes/coordinates-x-y';

@Injectable({
  providedIn: 'root'
})
export class CreateNewService {

  canvasSize: BehaviorSubject<CoordinatesXY> = new BehaviorSubject<CoordinatesXY>(new CoordinatesXY(0, 0));

}
