import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkingAreaComponent } from 'src/app/components/working-area/working-area.component';
import { Tools } from 'src/app/enums/tools';
import { HotkeysService } from '../hotkeys/hotkeys.service';
import { DrawerService } from '../side-nav-drawer/drawer.service';
import { ToolSelectorService } from '../tools-selector/tool-selector.service';

@Injectable({
  providedIn: 'root'
})
export class ShortcutManagerService {
  private subscriptions: Subscription[] = [];
  private workingAreaComponent: WorkingAreaComponent;
  private savedTool: Tools;

  constructor(
    public toolSelectorService: ToolSelectorService,
    private shortcut: HotkeysService,
    private drawerService: DrawerService
    ) {
      this.bypassBrowserShortcuts();
      this.savedTool = Tools.None;
    }

  saveCurrentTool(): void {
    this.savedTool = this.toolSelectorService.$currentTool.getValue();
    this.toolSelectorService.setCurrentTool(Tools.None);
  }

  loadSavedTool(): void {
    this.toolSelectorService.setCurrentTool(this.savedTool);
    this.drawerService.navIsOpened = true;
  }

  setWorkingAreaComponent(component: WorkingAreaComponent): void {
    this.workingAreaComponent = component;
  }

  disableShortcuts(): void {
    for (let i: number = this.subscriptions.length - 1; i >= 0; --i) {
      this.subscriptions[i].unsubscribe();
      this.subscriptions.pop();
    }
    this.bypassBrowserShortcuts();
  }

  setupShortcuts(): void {
    this.bypassBrowserShortcuts();
    this.subscriptions.forEach ( (subscription) => subscription.remove(subscription));
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 's', description: 'Selecting selection with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Selection);
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.a', description: 'Select all elements on canvas' }).subscribe(
      (event) => {
        if (this.toolSelectorService.$currentTool.getValue() === Tools.Selection) {
          this.toolSelectorService.getSelection().selectAllElements();
        }
      }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'l', description: 'Selecting line with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Line);
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'r', description: 'Selecting color applicator with shortcut' }).subscribe(
      (event) => {
        this.toolSelectorService.setCurrentTool(Tools.ColorApplicator);
      }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'c', description: 'Selecting pencil with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Pencil);
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.e', description: 'open export dialog' }).subscribe(
      (event) => {
        this.workingAreaComponent.exportProject();
      }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: '1', description: 'Selecting rectangle with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Rectangle);
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: '2', description: 'Selecting ellipse with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Ellipse);
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'w', description: 'Selecting brush with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Brush);
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'e', description: 'Selecting eraser with shortcut' }).subscribe(
      (event) => {
        this.toolSelectorService.setCurrentTool(Tools.Eraser);
      }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: '3', description: 'Selecting polygon with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Polygon);
        }
      )
    );
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'a', description: 'Selecting spray with shortcut' }).subscribe(
        (event) => {
          this.toolSelectorService.setCurrentTool(Tools.Spray);
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'i', description: 'Selecting pipette with shortcut' }).subscribe(
      (event) => {
        this.toolSelectorService.setCurrentTool(Tools.Pipette);
      }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'b', description: 'Selecting bucket with shortcut' }).subscribe(
      (event) => {
        this.toolSelectorService.setCurrentTool(Tools.Bucket);
      }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 't', description: 'Selecting text with shortcut' }).subscribe(
      (event) => {
        this.toolSelectorService.setCurrentTool(Tools.Text);
      }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.o', description: 'Opening create a new drawing' }).subscribe(
        (event) => {
          this.workingAreaComponent.createNewProject();
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.g', description: 'Opening gallery' }).subscribe(
      (event) => {
        this.workingAreaComponent.openGallery();
      }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.s', description: 'Opening Save on Server' }).subscribe(
      (event) => {
        this.workingAreaComponent.saveServerProject();
      }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.z', description: 'Undo' }).subscribe(
        (event) => {
          this.toolSelectorService.memory.undo();
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.shift.z', description: 'Redo' }).subscribe(
        (event) => {
          this.toolSelectorService.memory.redo();
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'g', description: 'Display/Undisplay grid' }).subscribe(
        (event) => {
          this.toolSelectorService.getGrid().toggle();
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: '+', description: 'Grid size ++' }).subscribe(
        (event) => {
          const grid = this.toolSelectorService.getGrid();
          if (grid.visible) {
            grid.incrementThickness();
          }
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: '-', description: 'Grid size --' }).subscribe(
      (event) => {
        const grid = this.toolSelectorService.getGrid();
        if (grid.visible) {
          grid.decrementThickness();
        }
      }
    )
  );
  }

  private bypassBrowserShortcuts(): void {
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.e', description: 'block search tab' }).subscribe(
      (event) => {
        // do nothing
      }
      )
    );
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.o', description: 'bypass open to save from chrome' }).subscribe(
      (event) => {
        // do nothing
      }
      )
    );
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.g', description: 'bypass search chrome' }).subscribe(
      (event) => {
        // do nothing
      }
      )
    );
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.s', description: 'bypass open to save from chrome' }).subscribe(
      (event) => {
        // do nothing
      }
      )
    );
  }
}
