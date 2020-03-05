import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SVGElementInfos } from 'src/app/interfaces/svg-element-infos';
import { Stack } from 'src/app/classes/stack';
import { Transform } from 'src/app/enums/transformations';
import { SVGProperties } from 'src/app/classes/svg-html-properties';

@Injectable({
  providedIn: 'root'
})
export class SelectionTransformService {
  
  private needsUpdate: BehaviorSubject<boolean>;
  private elementsToTransform: SVGElementInfos[] = [];

  constructor(private manipulator: Renderer2) { }

  setElements(elements: Stack<SVGElementInfos>) {
    this.elementsToTransform = elements.getAll();
  }

  transform(transformType: Transform, paramater1: number, paramater2?: number) {
    // transform="translate(10, 10) rotate(10)"
    /*switch (transformType) {
      case Transform.translation:
        this.translate(paramater1, paramater2);
        break;
      case Transform.rotation:
        break;
      case Transform.resize:
        break;
    }
    const initialElementTransform = this.selectedElements.getAll()[i].target.getAttribute(SVGProperties.transform);
    let oldTranslationX = '0';
    let oldTranslationY = '0';
    if (initialElementTransform !== null) {
      const oldTranslate = initialElementTransform.substring(initialElementTransform.indexOf("(") + 1, initialElementTransform.indexOf(")"));
      oldTranslationX = oldTranslate.split(',')[0];
      oldTranslationY = oldTranslate.substr(oldTranslate.indexOf(' ') + 1);
    }

    this.manipulator.setAttribute(this.selectedElements.getAll()[i].target, SVGProperties.transform, `translate(${+oldTranslationX + translationX}, ${+oldTranslationY + translationY})`);
    this.oldPointerOnMove = new CoordinatesXY(this.mousePosition.getX(), this.mousePosition.getY())
    this.setGeneratedAreaBorders();*/
  }
  
  translate(translationX: number, translationY: number) {
    for (let element of this.elementsToTransform) {
      const initialElementTransform = element.target.getAttribute(SVGProperties.transform);
      if (initialElementTransform === null) {
        this.manipulator.setAttribute(element, SVGProperties.transform, `${Transform.translation}(${translationX}, ${translationY})`)
      } else {
        const indexOfOldTranslate = initialElementTransform.indexOf("translate(");
        const oldTranslate = initialElementTransform.substring(initialElementTransform.indexOf("(") + 1, initialElementTransform.indexOf(")"));
        const newTranslationX = oldTranslate.split(',')[0];
        const newTranslationY = oldTranslate.substr(oldTranslate.indexOf(' ') + 1);
      }
    }
  }
}
