import { Injectable,
  // Renderer2
} from '@angular/core';
// import { Shape } from 'src/app/classes/shape';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { Stack } from 'src/app/classes/stack';
import { DrawableService } from '../drawable.service';
// import { SVGService } from '../../svg/svg.service';

@Injectable({
  providedIn: 'root'
})
export class LineService extends DrawableService {

  private isDrawing: boolean;
  private lineIsDone: boolean;
  private points: Stack<CoordinatesXY>;
  // private currentElement: SVGGElement;

  constructor(
    // private manipilator: Renderer2
    ) {
    super();
  }

  initialize(): void {
    throw new Error("Method not implemented.");
  }
  onMouseInCanvas(event: MouseEvent): void {
    throw new Error("Method not implemented.");
  }
  onMouseOutCanvas(event: MouseEvent): void {
    throw new Error("Method not implemented.");
  }

  addPointToLine(onScreenX: number, onScreenY: number): void {

    // Should make modifications
    // Screen's X and Y are not the same as the canvas'

    this.points.push_back(new CoordinatesXY(onScreenX, onScreenY));
  }

  onMousePress(event: MouseEvent): void {
    this.addPointToLine(event.clientX, event.clientY);
  }
  onMouseRelease(event: MouseEvent): void {
    throw new Error("Method not implemented.");
  }

  onDblClick(event: MouseEvent): void { // Should end line
    if (this.isDrawing) {
        this.isDrawing = false;
        if (!this.lineIsDone) {
          this.addPointToLine(event.clientX, event.clientY);
          this.lineIsDone = true;
        }
        // this.currentStack.addElement()
        this.points.clear();
    }
}

}
