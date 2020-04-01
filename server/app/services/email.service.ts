import { createReadStream, promises as fsp, unlinkSync } from 'fs';
import { injectable } from 'inversify';
import * as rp from 'request-promise';
import * as CONSTANTS from '../constants';
import * as REGEX from '../regular-expressions';

@injectable()
export class EmailService {

    // Inspired from https://stackoverflow.com/questions/8683895/how-do-i-determine-the-current-operating-system-with-node-js/8684009
    sanitizeUrl(url: string): string {
        let sanitizedUrl = url;
        if (process.platform === 'win32') {
            sanitizedUrl = sanitizedUrl.replace('C:', '');
            sanitizedUrl = sanitizedUrl.replace(/\\/g, '/');
        }
        return sanitizedUrl;
    }

    // Inspired from https://stackoverflow.com/questions/6926016/nodejs-saving-a-base64-encoded-image-to-disk
    async saveOnDisk(dataUrl: string, extension: string): Promise<string> {
        let base64Data = '';
        switch (extension) {
            case 'jpeg':
            case 'jpg':
                base64Data = dataUrl.replace(REGEX.REGEX_JPEG_DATAURL_PREFIX, '');
                break;
            case 'png':
                base64Data = dataUrl.replace(REGEX.REGEX_PNG_DATAURL_PREFIX, '');
                break;
            case 'svg':
                base64Data = dataUrl.replace(REGEX.REGEX_SVG_DATAURL_PREFIX, '');
                break;
        }
        const fileUlr = __dirname + '/out.' + extension;
        await fsp.writeFile(fileUlr, base64Data, 'base64');
        return fileUlr;
    }

    // Inspired from https://flaviocopes.com/how-to-remove-file-node/
    deleteFromDisk(fileUrl: string): void {
      try {
        unlinkSync(fileUrl);
      } catch (err) {
        throw new Error('Impossible d\'effacer le fichier du systeme');
      }
    }

    validateEmail(email: string): boolean {
      return REGEX.REGEX_EMAIL.test(email);
    }

    validateExtension(extension: string): boolean {
      return (extension === 'jpg' || extension === 'jpeg' || extension === 'svg' || extension === 'png');
    }

    async sendEmail(email: string, dataUrl: string, extension: string, title: string): Promise<number> {
        // Temporarily save image on local disk
        let fileUrl = await this.saveOnDisk(dataUrl, extension);

        // Sanitize local file URL before sending request
        fileUrl = this.sanitizeUrl(fileUrl);

        // Send image from local disk through REST API request
        const options = {
            method: 'POST',
            url: CONSTANTS.API_URL,
            headers: {
              'X-Team-Key': CONSTANTS.MAIL_API_KEY,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            formData: {
              to: email,
              payload: {
                value: createReadStream(fileUrl),
                options: {
                  filename: title + '.' + extension,
                  contentType: null
                }
              }
            },
            resolveWithFullResponse: true,
            simple: false
          };

        return await rp(options)
          .then((response) => {
            this.deleteFromDisk(fileUrl);
            return response.statusCode;
          })
          .catch((err) => {
            this.deleteFromDisk(fileUrl);
            throw new Error(err);
          });

    }

}
