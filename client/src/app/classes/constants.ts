// Line thickness
export const THICKNESS_MINIMUM = 1;
export const THICKNESS_DEFAULT = 5;
export const THICKNESS_MAXIMUM = 100;

// Line diameter
export const DIAMETER_MINIMUM = 1;
export const DIAMETER_DEFAULT = 5;
export const DIAMETER_MAXIMUM = 100;

// Line pixel detection
export const OFFSET_MIN = 3;
export const SIZEOF_POINT = 8;

// Eraser thickness
export const THICKNESS_MINIMUM_ERASER = 3;

// Polygone
export const DEFAULT_NSIDES = 3;

// Spray
export const DOT_RADIUS = 1;
export const DOTS_PER_SPRAY = 20;
export const DEFAULT_RADIUS = 5;
export const DEFAULT_FREQUENCY = 4;
export const MS_PER_S = 1000;

// Selection
export const CONTROL_SIZE = 6;
export const FIRST_DELAY = 500;
export const MOVE_DELAY = 100;
export const UNIT_MOVE = 3;
export const LEFT = 'ArrowLeft';
export const DOWN = 'ArrowDown';
export const RIGHT = 'ArrowRight';
export const UP = 'ArrowUp';

// Colors
export const DEFAULT_PRIMARY_COLOR = '#000000';
export const DEFAULT_SECONDARY_COLOR = '#FFFFFF';
export const DEFAULT_TRANSPARENCY = 1;
export const MAX_TRANSPARENCY = 1;
export const MIN_TRANSPARENCY = 0.01;
export const WORKSPACE_BACKGROUND = '808080';
export const  COLOR_MIN_VALUE = 0;
export const  COLOR_MAX_VALUE = 255;

export const COLOR_DEFAULT = '#000000';
export const OPACITY_DEFAULT = 1;
export const MAX_RECENT_COLORS = 10;
export const VISUAL_DIFFERENCE = 15; // %

// Math
export const HEX_BASE = 16;
export const HEX_LENGTH = 6;
export const DECIMAL_BASE = 10;
export const  BYTES_IN_HEX = 3;

export const FIRST_QUADRANT = 1;
export const SECOND_QUADRANT = 2;
export const THIRD_QUADRANT = 3;
export const FOURTH_QUADRANT = 4;

// Eraser
export const ERASER_OUTLINE = '#FF0000';
export const ERASER_OUTLINE_RED_ELEMENTS = '#8B0000';

// Grid
export const GRID_MINIMUM    = 5;
export const GRID_MAXIMUM    = 100;
export const OPACITY_MINIMUM = 0.3;
export const OPACITY_MAXIMUM = 1;
export const THICKNESS_STEP = 5;
// export const OPACITY_STEP = 0.1;

// Text 
export const DEFAULT_TEXT_SIZE = 12;
export const TEXT_SPACING = 1.5;
export let KEYS_TO_BYPASS = new Set<string>();
KEYS_TO_BYPASS.add('Shift');
KEYS_TO_BYPASS.add('Control');
KEYS_TO_BYPASS.add('NumLock');
KEYS_TO_BYPASS.add('Pause');
KEYS_TO_BYPASS.add('Home');
KEYS_TO_BYPASS.add('Tab');
KEYS_TO_BYPASS.add('CapsLock');
KEYS_TO_BYPASS.add('Alt');
KEYS_TO_BYPASS.add('ContextMenu');
KEYS_TO_BYPASS.add('ArrowUp');
KEYS_TO_BYPASS.add('ArrowDown');
KEYS_TO_BYPASS.add('Enter');
KEYS_TO_BYPASS.add('Backspace');
KEYS_TO_BYPASS.add('Delete');
KEYS_TO_BYPASS.add('Escape');
KEYS_TO_BYPASS.add('ArrowLeft');
KEYS_TO_BYPASS.add('ArrowRight');
KEYS_TO_BYPASS.add('|');
for(let i = 1; i < 13; ++i) {
    KEYS_TO_BYPASS.add('F'+i.toString());
}

// Gallery
export const TILE_WIDTH_PX = 250;
export const SVG_SERIAL_SIGNATURE = 'data:image/svg+xml;';
export const SVG_HTML_TAG = '<defs';

// SaveServer
export const MAX_TAGS_ALLOWED = 5;

// Export
export const EXPORT_MAX_WIDTH: number = 300;
export const EXPORT_MAX_HEIGHT: number = 270;

// Backend server
export const REST_API_ROOT = 'http://localhost:3000/api/images';

// MouseEvents
export const LEFT_CLICK = 0;
export const RIGHT_CLICK = 2;

// HTTP Codes
export const HTTP_STATUS_OK = 201;

