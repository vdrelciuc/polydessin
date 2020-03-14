import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { HttpStatus } from '../enums/http-status';
import { Image } from '../interfaces/image';
import { ImageService } from '../services/image.service';
import Types from '../types';

/*describe('ImageController', () => {
    let baseImage = {
        title: 'My image',
        tags: ['tag1', 'tag2', 'tag3'],
        serial: 'data:image/svg+xml;base64,PHN2Z',
        innerHtml: '<svg></svg>',
        width: 300,
        height: 300,
        background: 'rgb(255, 255, 255)'
     } as Image;

});*/

/*it('should return message from index service on valid get request to root', async () => {
    return supertest(app)
        .get('/api/index')
        .expect(HTTP_STATUS_OK)
        .then((response: any) => {
            expect(response.body).to.deep.equal(baseMessage);
        });
});*/

describe('ImageController', () => {
    let baseImage = {
        title: 'My image',
        tags: ['tag1', 'tag2', 'tag3'],
        serial: 'data:image/svg+xml;base64,PHN2Z',
        innerHtml: '<svg></svg>',
        width: 300,
        height: 300,
        background: 'rgb(255, 255, 255)'
     } as Image;
    let imageService: Stubbed<ImageService>;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.ImageService).toConstantValue({
            getAllImages: sandbox.stub().resolves([baseImage]),
            getImage: sandbox.stub().resolves(baseImage)
        });
        imageService = imageService; // todo: delete
        imageService = container.get(Types.ImageService);
        app = container.get<Application>(Types.Application).app;

    });

    it('should return an array of images for GET /api/images', async () => {
        return supertest(app)
            .get('/api/images')
            .expect(HttpStatus.OK)
            .then((response: any) => {
                expect(response.body).to.be.a('array');
            });
    });

    it('should return a single image on valid imageId for GET /api/images/:imageId', async () => {
        return supertest(app)
            .get('/api/images/validImageId')
            .expect(HttpStatus.OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(baseImage);
            });
    });

    it('should return an error on invalid imageId for GET /api/images/:imageId', async () => {
        imageService.getImage.returns('"Image not in database"');
        return supertest(app)
            .get('/api/images/invalidImageId')
            .expect(HttpStatus.NOT_FOUND)
            .expect('"Image not in database"')
            .then((response: any) => {
                expect(response.body).to.deep.equal(baseImage);
            });
    });
});
