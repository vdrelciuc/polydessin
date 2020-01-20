import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  readonly THICKNESS_MINIMUM: number = 1;
  readonly THICKNESS_DEFAULT: number = 5;
  readonly THICKNESS_MAXIMUM: number = 10;

  readonly JUNCTION_NONE = 0;
  readonly JUNCTION_DOTTED = 1;

  readonly JUNCTION_DIAMETER_MINIMUM = 1;
  readonly JUNCTION_DIAMETER_DEFAULT = 5;
  readonly JUNCTION_DIAMETER_MAXIMUM = 10;

  thickness: BehaviorSubject<number> = new BehaviorSubject(this.THICKNESS_DEFAULT);
  junction: BehaviorSubject<number> = new BehaviorSubject(this.JUNCTION_NONE);
  junctionDiameter: BehaviorSubject<number> = new BehaviorSubject(this.JUNCTION_DIAMETER_DEFAULT);
}
