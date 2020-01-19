import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

/*

  FOR ALL THE DRAWABLE ADD THE DEFAULT PARAMETERS HERE.
  With BehaviorSubject the state will change automatically when those parameters are changed by the user

*/

export class AttributesService {

  readonly THICKNESS_MINIMUM: number = 1;
  readonly THICKNESS_DEFAULT: number = 5;
  readonly THICKNESS_MAXIMUM: number = 10;

  readonly FONT_SIZE: number = 17;

  thickness: BehaviorSubject<number> = new BehaviorSubject(this.THICKNESS_DEFAULT);

  // Non Changeable
  font: BehaviorSubject<string> = new BehaviorSubject('Verdana, serif');
  fontSize: BehaviorSubject<number> = new BehaviorSubject(this.FONT_SIZE);
}
