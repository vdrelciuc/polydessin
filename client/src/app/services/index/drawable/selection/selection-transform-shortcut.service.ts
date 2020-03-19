import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Transform } from 'src/app/classes/transformations';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionTransformShortcutService {

  readonly FIRST_DELAY: number = 500;
  readonly MOVE_DELAY: number  = 100;
  readonly UNIT_MOVE: number  = 3;

  readonly LEFT: string = 'ArrowLeft';
  readonly DOWN: string = 'ArrowDown';
  readonly RIGHT: string = 'ArrowRight';
  readonly UP: string = 'ArrowUp';

  private lastKeyPressed: string;

  private leftArrowIsPressed: boolean;
  private rightArrowIsPressed: boolean;
  private upArrowIsPressed: boolean;
  private downArrowIsPressed: boolean;

  private manipulator: Renderer2;
  private image: ElementRef<SVGElement>;
  private drawStack: DrawStackService;
  private selectionGroup: SVGGElement;

  private isMoving: boolean;
  private hasWaitedHalfSec: boolean;

  private autoMoveHasInstance: boolean;

  private shortcutListener: (() => void)[] = [];

  setupShortcuts(manipulator: Renderer2, drawStack: DrawStackService, image: ElementRef<SVGElement>, selectionGroup: SVGGElement): void {
    this.deleteShortcuts();
    this.manipulator = manipulator;
    this.drawStack = drawStack;
    this.image = image;
    this.selectionGroup = selectionGroup;
    this.shortcutListener.push(manipulator.listen(window, 'keydown', (event: KeyboardEvent) => {
      this.onKeyDown(event.key);
    }));
    this.shortcutListener.push(manipulator.listen(window, 'keyup', (event: KeyboardEvent) => {
      this.onKeyUp(event.key);
    }));
  }

  deleteShortcuts(): void {
    this.shortcutListener.forEach((listener) => listener());
  }

  private onKeyDown(keyPressed: string): void {
    switch (keyPressed) {
      case this.LEFT:
        this.leftArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(-this.UNIT_MOVE, 0);
        }
        break;
      case this.RIGHT:
        this.rightArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(this.UNIT_MOVE, 0);
        }
        break;
      case this.UP:
        this.upArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(0, -this.UNIT_MOVE);
        }
        break;
      case this.DOWN:
        this.downArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(0, this.UNIT_MOVE);
        }
        break;
      default:
        break;
    }

    this.isMoving = true;
    if (!this.autoMoveHasInstance && (this.upArrowIsPressed || this.downArrowIsPressed
       || this.leftArrowIsPressed || this.rightArrowIsPressed)) {
      this.autoMoveHasInstance = true;
      this.autoMove();
    }

    this.lastKeyPressed = keyPressed;
  }

  private onKeyUp(keyReleased: string): void {
    switch (keyReleased) {
      case this.LEFT:
        this.leftArrowIsPressed = false;
        break;
      case this.RIGHT:
        this.rightArrowIsPressed = false;
        break;
      case this.UP:
        this.upArrowIsPressed = false;
        break;
      case this.DOWN:
        this.downArrowIsPressed = false;
        break;
      default:
        break;
    }

    if (!this.leftArrowIsPressed && !this.rightArrowIsPressed && !this.upArrowIsPressed && !this.downArrowIsPressed) {
      this.isMoving = false;
    }

    this.lastKeyPressed = '';
  }

  private async autoMove(): Promise<void> {
    if (this.isMoving) {
      if (this.hasWaitedHalfSec) {
        this.translate();
        setTimeout(() => this.autoMove(), this.MOVE_DELAY);
      } else {
        this.hasWaitedHalfSec = true;
        setTimeout(() => this.autoMove(), this.FIRST_DELAY);
      }
    } else {
      this.hasWaitedHalfSec = false;
      this.autoMoveHasInstance = false;

      this.selectionGroup.remove();
      this.drawStack.addSVGWithNewElement(this.image.nativeElement.cloneNode(true) as SVGElement);
      this.manipulator.appendChild(this.image.nativeElement, this.selectionGroup);
    }
  }

  private translate(): void {
    const translateX = (this.leftArrowIsPressed ? - this.UNIT_MOVE : 0) + (this.rightArrowIsPressed ? this.UNIT_MOVE : 0);
    const translateY = (this.upArrowIsPressed ? - this.UNIT_MOVE : 0) + (this.downArrowIsPressed ? this.UNIT_MOVE : 0);

    Transform.translate(translateX, translateY);
  }
}
