// Image
export const REGEX_TITLE: RegExp = /^[A-Za-z0-9- ]{3,16}$/; // Alphanumeric, space and dash: 3 to 16 chars
export const REGEX_TAG: RegExp = /^[A-Za-z0-9]{1,10}$/; // Alphanumeric, 1 to 10 chars
export const REGEX_JPEG_DATAURL_PREFIX: RegExp = /^data:image\/jpeg;base64,/; // data:image/jpeg;base64,
export const REGEX_PNG_DATAURL_PREFIX: RegExp = /^data:image\/png;base64,/; // data:image/png;base64,
export const REGEX_SVG_DATAURL_PREFIX: RegExp = /^data:image\/svg\+xml;base64,/; // data:image/svg+xml;base64,

// Email
export const REGEX_EMAIL: RegExp = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/m; // from https://regex101.com/library/SOgUIV
