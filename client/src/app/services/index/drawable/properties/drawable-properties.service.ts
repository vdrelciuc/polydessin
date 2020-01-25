import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CONSTANT from 'src/app/classes/constants';
import { Junctions } from 'src/app/classes/enums';

/*

      ADD HERE ALL THE PROPERTIES FOR THE DIFFERENT DRAWABLES

      Manual:
      1- Add to your service's constructor (
        ex: constructor(private propertiesManager: DrawablePropertiesService)
      )

      2- Subscribe to the properties your tool needs (in the constructor or somewhere else)
        ex: subscriberFunction(): void {
          this.propertiesManager.thickness.subscribe((newThickness) => {
            this.thickness = newThickness;
            // Insert here whatever you want to happen when the thickness is changed for exemple
        });
        }

*/

@Injectable({
  providedIn: 'root'
})
export class DrawablePropertiesService {

  readonly JUNCTION_DIAMETER_MINIMUM = 1;
  readonly JUNCTION_DIAMETER_DEFAULT = 5;
  readonly JUNCTION_DIAMETER_MAXIMUM = 10;

  thickness: BehaviorSubject<number> = new BehaviorSubject(CONSTANT.THICKNESS_DEFAULT);
  dotDiameter: BehaviorSubject<number> = new BehaviorSubject(CONSTANT.DIAMETER_DEFAULT);
  color: BehaviorSubject<string> = new BehaviorSubject(CONSTANT.COLOR_DEFAULT);
  opacity: BehaviorSubject<string> = new BehaviorSubject(CONSTANT.OPACITY_DEFAULT);
  junction: BehaviorSubject<boolean> = new BehaviorSubject(false);
  junctionDiameter: BehaviorSubject<Junctions> = new BehaviorSubject(this.JUNCTION_DIAMETER_DEFAULT);
}
