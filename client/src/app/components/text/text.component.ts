import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { MatSliderChange, MatRadioChange } from '@angular/material';
import { TextService } from 'src/app/services/index/drawable/text/text.service';
import { Subscription } from 'rxjs';
import { HotkeysService } from 'src/app/services/events/shortcuts/hotkeys.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { CharacterFont } from 'src/app/enums/character-font';
import { Alignment } from 'src/app/enums/text-alignement';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit, OnDestroy {
  
  private subscriptions: Subscription[] = [];

  constructor(
    private shortcutManager: ShortcutManagerService,
    private shortcuts: HotkeysService,
    public service: TextService,
    private toolSelector: ToolSelectorService) { 
      this.service = this.toolSelector.getText();
  }

  ngOnInit(): void {
    this.disableShortcuts();
    this.shortcutManager.disableShortcuts();
    this.setupShortcuts();
  }

  ngOnDestroy(): void {    
    this.disableShortcuts();
    this.shortcutManager.setupShortcuts();
  }

  setSize(event: MatSliderChange): void {
    const value = event.value;
    if(value !== null) {
      let attributes = this.service.properties.value;
      attributes.size = value;
      this.service.properties.next(attributes);
    }
  }

  updateBold(): void {
    let attributes = this.service.properties.value;
    attributes.isBold = !attributes.isBold;
    this.service.properties.next(attributes);
  }

  updateItalic(): void {
    let attributes = this.service.properties.value;
    attributes.isItalic = !attributes.isItalic;
    this.service.properties.next(attributes);
  }

  setFont(event: Event) {
    const font = (event.target as HTMLSelectElement).value as CharacterFont;
    if(font !== undefined) {
      let attributes = this.service.properties.value;
      attributes.font = font;
      this.service.properties.next(attributes);
    }
  }

  setAlignement(event: MatRadioChange): void {
    const value = event.value;
    if(value !== null) {
      const alignment = value as Alignment;
      if(alignment !== undefined) {
        let attributes = this.service.properties.value;
        attributes.alignment = alignment;
        this.service.properties.next(attributes);
      }
    }
  }

  private disableShortcuts(): void {
    for(let i: number = this.subscriptions.length - 1; i >= 0; --i) {
      this.subscriptions[i].unsubscribe();
      this.subscriptions.pop();
    }
  }

  private setupShortcuts(): void {
    this.subscriptions.push(this.shortcuts.addShortcut({ keys: 'arrowleft', description: 'Moving left' }).subscribe(
        (event) => {
          this.service.moveLeft();
        }
      )
    );

  this.subscriptions.push(this.shortcuts.addShortcut({ keys: 'arrowright', description: 'Moving right' }).subscribe(
        (event) => {
          this.service.moveRight();
        }
      )
    );
    this.subscriptions.push(this.shortcuts.addShortcut({ keys: 'enter', description: 'New Line' }).subscribe(
        (event) => {
          this.service.createCurrentTextBox();
        }
      )
    );

    this.subscriptions.push(this.shortcuts.addShortcut({ keys: 'delete', description: 'Delete next letter' }).subscribe(
        (event) => {
          this.service.delete();
        }
      )
    );

    this.subscriptions.push(this.shortcuts.addShortcut({ keys: 'backspace', description: 'Delete previous leter' }).subscribe(
        (event) => {
          this.service.backspace();
        }
      )
    );

    this.subscriptions.push(this.shortcuts.addShortcut({ keys: 'escape', description: 'Delete text' }).subscribe(
        (event) => {
          this.service.cancel();
        }
      )
    );
  }
}
