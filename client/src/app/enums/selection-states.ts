export enum SelectionState {
    selecting,
    moving,
    resizingTop, // Do not change resizing order: Top - Right - Bottom - Left
    resizingRight,
    resizingBottom,
    resizingLeft,
    inverting,
    singleLeftClickOutOfSelection,
    singleRightClick,
    leftClickInSelection,
    idle
}
