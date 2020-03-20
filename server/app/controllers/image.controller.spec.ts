import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { HttpStatus } from '../enums/http-status';
import { Image } from '../interfaces/image';
import { ImageService } from '../services/image.service';
import Types from '../types';

/*tslint:disable:no-any */
describe('ImageController', () => {
    const validImage = {
        title: 'My image',
        tags: ['tag1', 'tag2', 'tag3'],
        serial: 'data:image/svg+xml;base64,PHN2Z',
        innerHtml: '<defs',
        width: 300,
        height: 300,
        background: 'rgb(255, 255, 255)'
     } as Image;
    let imageService: Stubbed<ImageService>;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.ImageService).toConstantValue({
            getAllImages: sandbox.stub().resolves([validImage]),
            getImage: sandbox.stub().resolves(validImage),
            addImage: sandbox.stub().resolves(),
            deleteImage: sandbox.stub().resolves()
        });
        imageService = container.get(Types.ImageService);
        app = container.get<Application>(Types.Application).app;
    });

    it('should return an array of all images', async () => {
        return supertest(app)
            .get('/api/images')
            .then((response: any) => {
                expect(response.statusCode).to.equal(HttpStatus.OK);
                expect(response.body).to.be.a('array');
            });
    });

    it('should return a single image when sending validImageId', async () => {
        return supertest(app)
            .get('/api/images/validImageId')
            .then((response: any) => {
                expect(response.statusCode).to.equal(HttpStatus.OK);
                expect(response.body).to.deep.equal(validImage);
            });
    });

    it('should return an error when sending invalidImageId', async () => {
        imageService.getImage.rejects();
        return supertest(app)
            .get('/api/images/invalidImageId')
            .then((response: any) => {
                expect(response.statusCode).to.equal(HttpStatus.NOT_FOUND);
            })
            .catch((error: any) => {
                expect(error);
            });
    });

    it('should create an image when sending validImage', async () => {
        return supertest(app)
            .post('/api/images')
            .send(validImage)
            .then((response: any) => {
                expect(response.statusCode).to.equal(HttpStatus.CREATED);
            });
    });

    it('should return an error when sending invalidImage', async () => {
        imageService.addImage.rejects();
        return supertest(app)
            .post('/api/images')
            .send(validImage)
            .then((response: any) => {
                expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
            })
            .catch((error: any) => {
                expect(error);
            });
    });

    it('should delete an image when sending validImageId', async () => {
        return supertest(app)
            .delete('/api/images/validImageId')
            .then((response: any) => {
                expect(response.statusCode).to.equal(HttpStatus.NO_CONTENT);
            });
    });

    it('should send an error when sending invalidImageId', async () => {
        imageService.deleteImage.rejects();
        return supertest(app)
            .delete('/api/images/invalidImageId')
            .then((response: any) => {
                expect(response.statusCode).to.equal(HttpStatus.NOT_FOUND);
            });
    });
});
