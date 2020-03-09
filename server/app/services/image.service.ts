import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import { Image } from './../interfaces/image'

const DATABASE_URL = 'mongodb+srv://polyUser:2S9bKFzIPaMdTHHT!@projects-3dncm.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'Polydessin';
const DATABASE_COLLECTION = 'Image';

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
            })
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
    // inspired from https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
    private checkValidity(field: string): boolean {
        if (field === undefined || field === '') {
            return false;
        }
        for (let i = 0; i < field.length; ++i) {
            let asci = field.charCodeAt(i);
            if (!(asci > 47 && asci < 58) && // numeric (0-9)
                !(asci > 64 && asci < 91) && // upper alpha (A-Z)
                !(asci > 96 && asci < 123)){ // white space
                return false;
            }
        }

        return true;
    }

    private checkValidityOnArray(fields : string[]) : boolean{
        for (let i = 0 ; i< fields.length; i++){
            if (!this.checkValidity(fields[i])){
                return false;
            }
        }
        return true;
    }


    private validateImage(image: Image): boolean {
        const containsTitle = this.checkValidity(image.title);
        const containsCorrectTags = this.checkValidityOnArray(image.tags);
        const containsSerial = image.serial !== null && image.serial !== '';
        const containsInnerHtml = image.innerHtml !== null ;
        return containsTitle && containsSerial && containsInnerHtml && containsCorrectTags;
    }

    async deleteImage(idImage: string): Promise<void> {
        return this.collection
            .findOneAndDelete({ _id: new ObjectId(idImage) })
        .then(() => { })
        .catch((error: Error) => {
            throw new Error('Failed to delete image');
        });
    }
}
