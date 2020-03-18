import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import { Image } from './../interfaces/image';
import { REGEX_TITLE, REGEX_TAG} from '../regular-expressions';
import * as CONSTANTS from '../constants';

@injectable()
export class ImageService {

    collection: Collection<Image>;

    private options: MongoClientOptions = {
        useNewUrlParser : true,
        useUnifiedTopology : true
    };

    constructor() {
        MongoClient.connect(CONSTANTS.DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.collection = client.db(CONSTANTS.DATABASE_NAME).collection(CONSTANTS.DATABASE_COLLECTION);
            })
            .catch(() => {
                console.error('CONNECTION ERROR. EXITING PROCESS');
                process.exit(1);
            });
    }

    async getAllImages(): Promise<Image[]> {
        return this.collection.find({}).toArray()
            .then((images: Image[]) => {
                return images;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async getImage(idImage: string): Promise<Image> {
        return this.collection.findOne({ _id: new ObjectId(idImage) })
                .then((image: Image) => {
                    if (image === null) {
                        throw new Error('Image not in database');
                    }
                    return image;
                })
                .catch((error: Error) => {
                    throw error;
                });
    }

    async addImage(image: Image): Promise<void> {
        if (this.validateImage(image)) {
            this.collection.insertOne(image).catch((error: Error) => {
                throw error;
            });
        } else {
            throw new Error('Invalid image');
        }
    }

    async deleteImage(idImage: string): Promise<void> {
        return this.collection
            .findOneAndDelete({ _id: new ObjectId(idImage) })
        .then(() => {
            // do nothing
         })
        .catch((error: Error) => {
            throw new Error('Failed to delete image');
        });
    }

    validateTitle(title: string): boolean {
        return REGEX_TITLE.test(title);
    }

    validateTags(tags: string[]): boolean {
        let listIsValid = true;
        let tagCount = 0;
        tags.forEach((tag) => {
            if (!REGEX_TAG.test(tag)) {
                listIsValid = false;
            }
            tagCount++;
        });
        return listIsValid && (tagCount <= CONSTANTS.MAX_TAGS_ALLOWED);
    }

    validateImage(image: Image): boolean {
        const containsValidTitle = this.validateTitle(image.title);
        const containsCorrectTags = this.validateTags(image.tags);
        const validWidth = image.width !== null && image.width > 0;
        const validHeight = image.height !== null && image.height > 0;
        const validSerial = image.serial !== null && (image.serial).toString().includes(CONSTANTS.SVG_SERIAL_SIGNATURE);
        const validHtml = image.innerHtml !== null && (image.innerHtml).toString().includes(CONSTANTS.SVG_HTML_TAG);
        const validBackground = image.background !== null && image.background !== '';
        return containsValidTitle && containsCorrectTags && validWidth && validHeight && validSerial && validHtml && validBackground;
    }
}
