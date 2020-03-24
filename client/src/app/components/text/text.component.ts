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
    this.shortcutManager.disableShortcuts();
    this.setupShortcuts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach ( (subscription) => subscription.unsubscribe() );
    this.shortcutManager.setupShortcuts();
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

  setSize(event: MatSliderChange): void {
    const value = event.value;
    if(value !== null) {
      this.service.size.next(value);
    }
  }

  updateBold(): void {
    this.service.isBold.next(!this.service.isBold.value);
  }

  updateItalic(): void {
    this.service.isItalic.next(!this.service.isItalic.value);
  }

  setFont(event: Event) {
    const font = (event.target as HTMLSelectElement).value as CharacterFont;
    if(font !== undefined) {
      this.service.font.next(font);
    }
  }

  setAlignement(event: MatRadioChange): void {
    const value = event.value;
    if(value !== null) {
      const alignement = value as Alignment;
      if(alignement !== undefined) {
        this.service.alignment.next(alignement);
      }
    }
  }
}
