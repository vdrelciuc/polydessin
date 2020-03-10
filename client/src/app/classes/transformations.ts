import { BehaviorSubject } from 'rxjs';
import { SVGElementInfos } from '../interfaces/svg-element-infos';
import { Renderer2 } from '@angular/core';
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
  private static elementsToTransform: SVGElementInfos[] = [];
  private static manipulator: Renderer2;
  constructor() { }

  static setElements(elements: Stack<SVGElementInfos>, manipulator: Renderer2) {
    Transform.elementsToTransform = elements.getAll();
    Transform.manipulator = manipulator;
  }

  static translate(translationX: number, translationY: number) {
    for (let element of Transform.elementsToTransform) {
      const initialElementTransform = element.target.getAttribute(SVGProperties.transform);
      if (initialElementTransform === null) {
        Transform.manipulator.setAttribute(element.target, SVGProperties.transform, `${TransformType.translation}(${translationX}, ${translationY})`)
      } else {
        const indexOfOldTranslate = initialElementTransform.indexOf('translate(');
        if (indexOfOldTranslate === -1) {
          Transform.manipulator.setAttribute(element.target, SVGProperties.transform, `${initialElementTransform} ${TransformType.translation}(${translationX}, ${translationY})`)
        } else {
          const indexOfOldX = initialElementTransform.indexOf('(', indexOfOldTranslate) + 1;
          const indexOfOldY = initialElementTransform.indexOf(')', indexOfOldTranslate);
          const oldTranslate = initialElementTransform.substring(indexOfOldX, indexOfOldY);
          const oldTranslationX = oldTranslate.split(',')[0];
          const oldTranslationY = oldTranslate.split(',')[1];
          const newTransform = `${initialElementTransform.substring(0, indexOfOldX)}${+oldTranslationX + translationX}, ${+oldTranslationY + translationY}${initialElementTransform.substring(indexOfOldY)}`;
          Transform.manipulator.setAttribute(element.target, SVGProperties.transform, newTransform);
        }
      }
    }
    Transform.needsUpdate.next(true);
  }
}