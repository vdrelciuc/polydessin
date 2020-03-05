import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectionTransformShortcutService {

  readonly left = 'ArrowLeft';
  readonly down = 'ArrowDown';
  readonly right = 'ArrowRight';
  readonly up = 'ArrowUp';

  private lastKeyPressed: string;

  private leftArrowIsPressed: boolean;
  private rightArrowIsPressed: boolean;
  private upArrowIsPressed: boolean;
  private downArrowIsPressed: boolean;

  private isMoving: boolean;
  private hasWaitedHalfSec: boolean;

  private shortcutListener: (() => void)[] = [];

  constructor() { }

  setupShortcuts(manipulator: Renderer2): void {
    this.deleteShortcuts();
    this.shortcutListener.push(manipulator.listen(window, 'keydown', (event: KeyboardEvent) => {
      this.onKeyDown(event.key);
    }));
    this.shortcutListener.push(manipulator.listen(window, 'keyup', (event: KeyboardEvent) => {
      this.onKeyUp(event.key);
    }));
  }

  deleteShortcuts() {
    this.shortcutListener.forEach(listener => (listener()));
  }

  fct() {
    console.log(undefined === 'left');
  }

  private onKeyDown(keyPressed: string): void {
    switch (keyPressed) {
      case this.left:
        this.leftArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          // Move
        }
        break;
      case this.right:
        this.rightArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          // Move
        }
        break;
      case this.up:
        this.upArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          // Move
        }
        break;
      case this.down:
        this.downArrowIsPressed = true;
        if (this.lastKeyPressed !== keyPressed) {
          // Move
        }
        break;
      default:
        break;
    }

    this.isMoving = true;
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
}
