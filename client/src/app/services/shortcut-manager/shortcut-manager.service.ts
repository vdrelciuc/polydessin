import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { Tools } from 'src/app/enums/tools';
import { HotkeysService } from '../events/shortcuts/hotkeys.service';
import { ToolSelectorService } from '../tools/tool-selector.service';

@Injectable({
  providedIn: 'root'
})
export class ShortcutManagerService {
  private subscriptions: Subscription[] = [];
  private sidebarComponent: SidebarComponent;

  constructor(
    public toolSelectorService: ToolSelectorService,
    private shortcut: HotkeysService,
    ) {
      this.bypassBrowserShortcuts();
    }

  setSidebarComponent(sidebar: SidebarComponent): void {
    this.sidebarComponent = sidebar;
  }

  disableShortcuts(): void {
    this.subscriptions.forEach ( (subscription) => subscription.unsubscribe() );
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
        if (this.toolSelectorService.$currentTool.getValue() !== Tools.Selection) {
          this.toolSelectorService.setCurrentTool(Tools.Selection);
        }
        this.toolSelectorService.getSelection().selectAllElements();
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
        this.sidebarComponent.exportProject();
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
    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'A', description: 'Selecting spray with shortcut' }).subscribe(
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

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.o', description: 'Opening create a new drawing' }).subscribe(
        (event) => {
          this.sidebarComponent.createNewProject();
        }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.g', description: 'Opening gallery' }).subscribe(
      (event) => {
        this.sidebarComponent.openGallery();
      }
      )
    );

    this.subscriptions.push(this.shortcut.addShortcut({ keys: 'control.s', description: 'Opening Save on Server' }).subscribe(
      (event) => {
        this.sidebarComponent.saveServerProject();
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
  }
}
