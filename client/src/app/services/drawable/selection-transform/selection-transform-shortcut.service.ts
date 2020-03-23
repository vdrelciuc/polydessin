import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import * as CONSTANTS from 'src/app/classes/constants';
import { Transform } from 'src/app/classes/transformations';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionTransformShortcutService {
  private readonly fastRotate: number  = 15;
  private readonly slowRotate: number  = 1;

  private readonly REGEX_ARROW: RegExp = /^Arrow/i;
  private readonly delete: string = 'Delete';
  private readonly x: string = 'x';
  private readonly c: string = 'c';
  private readonly v: string = 'v';
  private readonly d: string = 'd';

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
      this.onKeyDown(event);
    }));
    this.shortcutListener.push(manipulator.listen(window, 'wheel', (event: WheelEvent) => {
      console.log('xd');
      console.log(event);
      if (event.shiftKey) {
        Transform.rotateEach(this.getRotate(event));
      } else {
        Transform.rotate(this.getRotate(event));
      }
    }));
    this.shortcutListener.push(manipulator.listen(window, 'keyup', (event: KeyboardEvent) => {
      this.onKeyUp(event.key);
    }));
  }
  getRotate(event: WheelEvent): number {
    const rotate = (event.altKey) ? this.slowRotate : this.fastRotate;
    return rotate * event.deltaY;
  }

  deleteShortcuts(): void {
    this.shortcutListener.forEach((listener) => listener());
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (this.REGEX_ARROW.test(event.key)) {
      this.arrowPressed(event.key);
    } else {
      switch (event.key) {
        case this.delete:
          Transform.delete();
          this.selectionGroup.remove();
          this.drawStack.addSVG(this.image.nativeElement.cloneNode(true) as SVGElement);
          break;
          case this.x:
            if (event.ctrlKey) {
              ClipboardService.cut();
            }
            break;
          case this.c:
            if (event.ctrlKey) {
              ClipboardService.copy();
            }
            break;
          case this.v:
            if (event.ctrlKey) {
              ClipboardService.paste();
            }
            break;
          case this.d:
            if (event.ctrlKey) {
              ClipboardService.duplicate();
              event.preventDefault();
            }
            break;
        default:
          break;
      }
    }
    this.lastKeyPressed = event.key;
  }

  private arrowPressed(keyPressed: string): void {
    switch (keyPressed) {
      case CONSTANTS.LEFT:
        this.leftArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(-CONSTANTS.UNIT_MOVE, 0);
        }
        break;
      case CONSTANTS.RIGHT:
        this.rightArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(CONSTANTS.UNIT_MOVE, 0);
        }
        break;
      case CONSTANTS.UP:
        this.upArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(0, -CONSTANTS.UNIT_MOVE);
        }
        break;
      case CONSTANTS.DOWN:
        this.downArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(0, CONSTANTS.UNIT_MOVE);
        }
        break;
    }

    this.isMoving = true;
    const hasAKeyPressed = this.upArrowIsPressed || this.downArrowIsPressed || this.leftArrowIsPressed || this.rightArrowIsPressed;
    if (!this.autoMoveHasInstance && hasAKeyPressed) {
      this.autoMoveHasInstance = true;
      this.autoMove();
    }
  }

  private onKeyUp(keyReleased: string): void {
    switch (keyReleased) {
      case CONSTANTS.LEFT:
        this.leftArrowIsPressed = false;
        break;
      case CONSTANTS.RIGHT:
        this.rightArrowIsPressed = false;
        break;
      case CONSTANTS.UP:
        this.upArrowIsPressed = false;
        break;
      case CONSTANTS.DOWN:
        this.downArrowIsPressed = false;
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
        setTimeout(() => this.autoMove(), CONSTANTS.MOVE_DELAY);
      } else {
        this.hasWaitedHalfSec = true;
        setTimeout(() => this.autoMove(), CONSTANTS.FIRST_DELAY);
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
    const translateX = (this.leftArrowIsPressed ? - CONSTANTS.UNIT_MOVE : 0) + (this.rightArrowIsPressed ? CONSTANTS.UNIT_MOVE : 0);
    const translateY = (this.upArrowIsPressed ? - CONSTANTS.UNIT_MOVE : 0) + (this.downArrowIsPressed ? CONSTANTS.UNIT_MOVE : 0);

    Transform.translate(translateX, translateY);
  }
}
