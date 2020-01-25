import { Injectable, ElementRef, Renderer, Renderer2 } from '@angular/core';
import { DrawableService } from '../index/drawable/drawable.service';
import { ToolSelectorService } from '../tools/tool-selector.service';

@Injectable({
  providedIn: 'root'
})
export class EventListenerService {

  currentTool: DrawableService | undefined;

  constructor(
    private image: ElementRef<SVGElement>,
    private toolSelector: ToolSelectorService,
    private manipulator: Renderer2
  ) {
    this.toolSelector.$currentTool.subscribe ( (tool) => {
      this.currentTool = this.toolSelector.getCurrentTool();
    });
   }

   addListeners(): void {
     this.manipulator.listen(this.image.nativeElement, 'mousemove', (event: MouseEvent) => {
      if (this.currentTool !== undefined) {
        this.currentTool.onMouseMove(event);
      }
     });

     this.manipulator.listen(this.image.nativeElement, 'mouseenter', (event: MouseEvent) => {
      if (this.currentTool !== undefined) {
        this.currentTool.onMouseInCanvas(event);
      }
     });

     this.manipulator.listen(this.image.nativeElement, 'mouseleave', (event: MouseEvent) => {
      if (this.currentTool !== undefined) {
        this.currentTool.onMouseOutCanvas(event);
      }
     });


   }
}
