import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Transform } from 'src/app/classes/transformations';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionTransformShortcutService {

  readonly firstDelay: number = 500;
  readonly moveDelay: number  = 100;
  readonly unitMove: number  = 3;
  readonly fastRotate: number  = Math.PI * 15 / 180;
  readonly slowRotate: number  = Math.PI / 180;

  private readonly REGEX_ARROW: RegExp = /^Arrow/i;
  readonly left: string = 'ArrowLeft';
  readonly down: string = 'ArrowDown';
  readonly right: string = 'ArrowRight';
  readonly up: string = 'ArrowUp';
  readonly ctrl: string = 'Control';
  readonly delete: string = 'Delete';
  readonly x: string = 'x';
  readonly c: string = 'c';
  readonly v: string = 'v';
  readonly d: string = 'd';

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
        Transform.rotateEach((event.altKey) ? this.slowRotate : this.fastRotate);
      } else {
        // Transform.rotate((event.altKey) ? 1 : 15);
      }
    }));
    this.shortcutListener.push(manipulator.listen(window, 'keyup', (event: KeyboardEvent) => {
      this.onKeyUp(event.key);
    }));
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
      case this.left:
        this.leftArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(-this.unitMove, 0);
        }
        break;
      case this.right:
        this.rightArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(this.unitMove, 0);
        }
        break;
      case this.up:
        this.upArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(0, -this.unitMove);
        }
        break;
      case this.down:
        this.downArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          Transform.translate(0, this.unitMove);
        }
        break;
      }

    this.isMoving = true;
    if (!this.autoMoveHasInstance && (this.upArrowIsPressed || this.downArrowIsPressed
       || this.leftArrowIsPressed || this.rightArrowIsPressed)) {
      this.autoMoveHasInstance = true;
      this.autoMove();
    }
  }

  private onKeyUp(keyReleased: string): void {
    switch (keyReleased) {
      case this.left:
        this.leftArrowIsPressed = false;
        break;
      case this.right:
        this.rightArrowIsPressed = false;
        break;
      case this.up:
        this.upArrowIsPressed = false;
        break;
      case this.down:
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
        setTimeout(() => this.autoMove(), this.moveDelay);
      } else {
        this.hasWaitedHalfSec = true;
        setTimeout(() => this.autoMove(), this.firstDelay);
      }
    } else {
      this.hasWaitedHalfSec = false;
      this.autoMoveHasInstance = false;

      this.selectionGroup.remove();
      this.drawStack.addSVG(this.image.nativeElement.cloneNode(true) as SVGElement);
      this.manipulator.appendChild(this.image.nativeElement, this.selectionGroup);
    }
  }

  private translate(): void {
    const translateX = (this.leftArrowIsPressed ? - this.unitMove : 0) + (this.rightArrowIsPressed ? this.unitMove : 0);
    const translateY = (this.upArrowIsPressed ? - this.unitMove : 0) + (this.downArrowIsPressed ? this.unitMove : 0);

    Transform.translate(translateX, translateY);
  }
}
