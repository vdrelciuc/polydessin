import { Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Stack } from './stack';
import { SVGProperties } from './svg-html-properties';

export enum TransformType {
  translation = 'translate',
  rotation = 'rotate',
  resize = 'scale',
  distorsionX = 'skewX',
  distorsionY = 'skewY'
}

export class Transform {

  static needsUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  static elementsToTransform: SVGGElement[] = [];
  private static manipulator: Renderer2;

  static setElements(elements: Stack<SVGGElement>, manipulator: Renderer2): void {
    Transform.elementsToTransform = elements.getAll();
    Transform.manipulator = manipulator;
  }

  static translate(translationX: number, translationY: number): void {
    for (const element of Transform.elementsToTransform) {
      const initialElementTransform = element.getAttribute(SVGProperties.transform);
      if (initialElementTransform === null) {
        const newTransform = `${TransformType.translation}(${translationX}, ${translationY})`;
        Transform.manipulator.setAttribute(element, SVGProperties.transform, newTransform);
      } else {
        const indexOfOldTranslate = initialElementTransform.indexOf('translate(');
        /*tslint:disable-next-line: no-magic-numbers*/
        if (indexOfOldTranslate === -1) {
          const newTransform = `${TransformType.translation}(${translationX}, ${translationY}) ${initialElementTransform}`;
          Transform.manipulator.setAttribute(element, SVGProperties.transform, newTransform);
        } else {
          const indexOfOldX = initialElementTransform.indexOf('(', indexOfOldTranslate) + 1;
          const indexOfOldY = initialElementTransform.indexOf(')', indexOfOldTranslate);
          const oldTranslate = initialElementTransform.substring(indexOfOldX, indexOfOldY);
          const oldTranslationX = oldTranslate.split(',')[0];
          const oldTranslationY = oldTranslate.split(',')[1];
          const textBeforeParenthesis = initialElementTransform.substring(0, indexOfOldX);
          const textAfterParenthesis = initialElementTransform.substring(indexOfOldY);
          const newCoordinates = `${+oldTranslationX + translationX}, ${+oldTranslationY + translationY}`;
          const newTransform = textBeforeParenthesis + newCoordinates + textAfterParenthesis;
          Transform.manipulator.setAttribute(element, SVGProperties.transform, newTransform);
        }
      }
    }
    Transform.needsUpdate.next(true);
  }

  static rotateEach(rotation: number): void {
    for (const element of Transform.elementsToTransform) {
      const initialElementTransform = element.getAttribute(SVGProperties.transform);
      const bBox = element.getBBox();
      if (initialElementTransform === null) {
        const newTransform = `${TransformType.rotation}(${rotation}, ${bBox.x + bBox.width / 2}, ${bBox.y + bBox.height / 2})`;
        Transform.manipulator.setAttribute(element, SVGProperties.transform, newTransform);
      } else {
        const indexOfOldTranslate = initialElementTransform.indexOf('rotate(');
        /*tslint:disable-next-line: no-magic-numbers*/
        if (indexOfOldTranslate === -1) {
          const newTransform = ` ${initialElementTransform} ` +
          `${TransformType.rotation}(${rotation}, ${bBox.x + bBox.width / 2}, ${bBox.y + bBox.height / 2})`;
          Transform.manipulator.setAttribute(element, SVGProperties.transform, newTransform);
        } else {
          const indexOfOldX = initialElementTransform.indexOf('(', indexOfOldTranslate) + 1;
          const indexOfOldY = initialElementTransform.indexOf(',', indexOfOldTranslate);
          const oldRotate = initialElementTransform.substring(indexOfOldX, indexOfOldY);
          const textBeforeParenthesis = initialElementTransform.substring(0, indexOfOldX);
          const textAfterParenthesis = initialElementTransform.substring(indexOfOldY);
          const newRotate = `${+oldRotate + rotation}`;
          const newTransform = textBeforeParenthesis + newRotate + textAfterParenthesis;
          Transform.manipulator.setAttribute(element, SVGProperties.transform, newTransform);
        }
      }
    }
    Transform.needsUpdate.next(true);
  }

  static delete(): void {
    for (const element of Transform.elementsToTransform) {
      element.remove();
    }
    Transform.needsUpdate.next(true);
  }
}
