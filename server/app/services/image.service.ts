import { injectable } from 'inversify';
import { Message } from '../../../common/communication/message';

@injectable()
export class ImageService {

    about(): Message {
        return {
            title: 'Hey from ImageService',
            body: 'How is it going?',
        };
    }
}
