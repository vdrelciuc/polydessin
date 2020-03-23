import { expect } from 'chai';
import * as sinon from 'sinon';
import { testingContainer } from '../../test/test-utils';
import { Image } from '../interfaces/image';
import Types from '../types';
import { ImageService } from './image.service';

describe('Image Service', () => {
    let imageService: ImageService;
    let validImage: Image;

    beforeEach(async () => {
        validImage = {
            title: 'Valid title',
            tags: ['tag1', 'tag2'],
            serial: 'data:image/svg+xml;base64, ...',
            innerHtml: '<defs...',
            width: 500,
            height: 300,
            background: 'rgb(0,255,255)'
        } as Image;
        const [container] = await testingContainer();
        imageService = container.get<ImageService>(Types.ImageService);
    });

    it('#getAllImages should return all images', async () => {
        const expectedResult: Image[] = [validImage];
        sinon.stub(ImageService.prototype, 'getAllImages').callsFake(async (): Promise<Image[]> => {
            return [validImage];
        });
        const actualResult = await imageService.getAllImages();
        expect(actualResult).to.deep.equal(expectedResult);
    });

    it('#getImage should return an image for a validImageId', async () => {
        const expectedResult: Image = validImage;
        sinon.stub(ImageService.prototype, 'getImage').callsFake(async (): Promise<Image> => {
            return validImage;
        });
        const actualResult = await imageService.getImage('validImageId');
        expect(actualResult).to.deep.equal(expectedResult);
    });

    it('#addImage should add an image when sent a valid image', async () => {
        const stub = sinon.stub(ImageService.prototype, 'addImage').calledWith(validImage);
        await imageService.addImage(validImage);
        expect(stub);
    });

    it('#deleteImage should delete an image when sent a validImageId', async () => {
        const stub = sinon.stub(ImageService.prototype, 'deleteImage').calledWith('validImageId');
        await imageService.deleteImage('validImageId');
        expect(stub);
    });

    it('#validateTitle should allow a valid title', () => {
        const validTitle = 'My-valid title1';
        const result = imageService.validateTitle(validTitle);
        expect(result).equal(true);
    });

    it('#validateTitle should deny an empty title', () => {
        const emptyTitle = '';
        const result = imageService.validateTitle(emptyTitle);
        expect(result).equal(false);
    });

    it('#validateTitle should deny a title containing special characters', () => {
        const specialTitle = 'Hello !';
        const result = imageService.validateTitle(specialTitle);
        expect(result).equal(false);
    });

    it('#validateTitle should deny a title that is too short', () => {
        const shortTitle = 'Hi';
        const result = imageService.validateTitle(shortTitle);
        expect(result).equal(false);
    });

    it('#validateTitle should deny a title that is too long', () => {
        const longTitle = 'This is a way too long title';
        const result = imageService.validateTitle(longTitle);
        expect(result).equal(false);
    });

    it('#validateTags should allow valid tags', () => {
        const validTags = ['tag1', 'longtag2'];
        const result = imageService.validateTags(validTags);
        expect(result).equal(true);
    });

    it('#validateTags should allow no tags', () => {
        const noTags: string[] = [];
        const result = imageService.validateTags(noTags);
        expect(result).equal(true);
    });

    it('#validateTags should deny too many tags', () => {
        const tooManyTags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6'];
        const result = imageService.validateTags(tooManyTags);
        expect(result).equal(false);
    });

    it('#validateTags should deny empty tags', () => {
        const emptyTags = [''];
        const result = imageService.validateTags(emptyTags);
        expect(result).equal(false);
    });

    it('#validateTags should deny tags containing special characters', () => {
        const emptyTags = ['MyTag!'];
        const result = imageService.validateTags(emptyTags);
        expect(result).equal(false);
    });

    it('#validateTags should deny tags that are too long', () => {
        const longTags = ['VeryLongTag'];
        const result = imageService.validateTags(longTags);
        expect(result).equal(false);
    });

    it('#validateImage should allow valid image', () => {
        const result = imageService.validateImage(validImage);
        expect(result).equal(true);
    });

    it('#validateImage should deny an image with empty serial', () => {
        const invalidImage = validImage;
        invalidImage.serial = '';
        const result = imageService.validateImage(invalidImage);
        expect(result).equal(false);
    });

    it('#validateImage should deny an image with invalid serial', () => {
        const invalidImage = validImage;
        invalidImage.serial = 'Invalid serial';
        const result = imageService.validateImage(invalidImage);
        expect(result).equal(false);
    });

    it('#validateImage should deny an image with empty html', () => {
        const invalidImage = validImage;
        invalidImage.innerHtml = '';
        const result = imageService.validateImage(invalidImage);
        expect(result).equal(false);
    });

    it('#validateImage should deny an image with invalid html', () => {
        const invalidImage = validImage;
        invalidImage.innerHtml = 'Invalid html';
        const result = imageService.validateImage(invalidImage);
        expect(result).equal(false);
    });

    it('#validateImage should deny an image with null width', () => {
        const invalidImage = validImage;
        invalidImage.width = 0;
        const result = imageService.validateImage(invalidImage);
        expect(result).equal(false);
    });

    it('#validateImage should deny an image with negative width', () => {
        const invalidImage = validImage;
        /*tslint:disable-next-line: no-magic-numbers*/
        invalidImage.width = -5;
        const result = imageService.validateImage(invalidImage);
        expect(result).equal(false);
    });

    it('#validateImage should deny an image with null height', () => {
        const invalidImage = validImage;
        invalidImage.height = 0;
        const result = imageService.validateImage(invalidImage);
        expect(result).equal(false);
    });

    it('#validateImage should deny an image with negative height', () => {
        const invalidImage = validImage;
        /*tslint:disable-next-line: no-magic-numbers*/
        invalidImage.height = -5;
        const result = imageService.validateImage(invalidImage);
        expect(result).equal(false);
    });

    it('#validateImage should deny an image with empty background', () => {
        const invalidImage = validImage;
        invalidImage.background = '';
        const result = imageService.validateImage(invalidImage);
        expect(result).equal(false);
    });
});
