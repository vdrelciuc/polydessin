import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import { Image } from './../interfaces/image';

const DATABASE_URL = 'mongodb+srv://polyUser:2S9bKFzIPaMdTHHT!@projects-3dncm.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'Polydessin';
const DATABASE_COLLECTION = 'Image';
const REGEX_TITLE: RegExp = /^[A-Za-z0-9- ]{3,16}$/; // Alphanumeric, space and dash: 3 to 16 chars
const REGEX_TAG: RegExp = /^[A-Za-z0-9]{1,10}$/; // Alphanumeric, 1 to 10 chars

@injectable()
export class ImageService {

    collection: Collection<Image>;

    private options: MongoClientOptions = {
        useNewUrlParser : true,
        useUnifiedTopology : true
    };

    constructor() {
        MongoClient.connect(DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
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
        return  this.collection.findOne({ _id: new ObjectId(idImage) })
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

    private validateTitle(title: string): boolean {
        return REGEX_TITLE.test(title);
    }

    private validateTags(tags: string[]): boolean {
        let listIsValid = true;
        tags.forEach((tag) => {
            if (!REGEX_TAG.test(tag)) {
                listIsValid = false;
            }
        });
        return listIsValid;
    }

    private validateImage(image: Image): boolean {
        const containsValidTitle = this.validateTitle(image.title);
        const containsCorrectTags = this.validateTags(image.tags);
        const containsSerial = image.serial !== null && image.serial !== '';
        const containsInnerHtml = image.innerHtml !== null ;
        return containsValidTitle && containsCorrectTags && containsSerial && containsInnerHtml;
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
}
