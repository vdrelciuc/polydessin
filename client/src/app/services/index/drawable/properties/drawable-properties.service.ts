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

<<<<<<< HEAD
  thickness: BehaviorSubject<number> = new BehaviorSubject(CONSTANT.THICKNESS_DEFAULT);
  junction: BehaviorSubject<Junctions> = new BehaviorSubject(Junctions.None);
  junctionDiameter: BehaviorSubject<Junctions> = new BehaviorSubject(this.JUNCTION_DIAMETER_DEFAULT);
=======
  private thickness: BehaviorSubject<number> = new BehaviorSubject(CONSTANT.THICKNESS_DEFAULT);
  private junction: BehaviorSubject<Junctions> = new BehaviorSubject(Junctions.None);
  private junctionDiameter: BehaviorSubject<number> = new BehaviorSubject(this.JUNCTION_DIAMETER_DEFAULT);

  getThickness(): number { return this.thickness.value; }
  getJunction(): Junctions { return this.junction.value ; }
  isJunctionADot(): boolean {
    if (this.junction.value === Junctions.Dots) {
      return true;
    }
    return false;
  }
  getJunctionDiameter(): number { return this.junctionDiameter.value; }

>>>>>>> b6ae071e39bd5fc2dbbd572d56f23e9c65cb172a
}
