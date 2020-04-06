import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { HttpStatus } from '../enums/http-status';
import { EmailService } from '../services/email.service';
import Types from '../types';

describe('EmailController', () => {
    let emailService: Stubbed<EmailService>;
    let app: Express.Application;
    const validReq = {
        to: 'valid@email.com',
        payload: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA',
        extension: 'jpeg',
        title: 'Valid title'
    };

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.ImageService).toConstantValue({
            sendEmail: sandbox.stub().resolves(),
            validateTitle: sandbox.stub().returns(true),
            validateEmail: sandbox.stub().returns(true),
            validateExtension: sandbox.stub().returns(true)
        });
        emailService = emailService;
        emailService = container.get(Types.ImageService);
        app = container.get<Application>(Types.Application).app;
    });

    it('should allow a valid request', async () => {
        return supertest(app)
            .post('/api/email')
            .send({to: validReq.to, payload: validReq.payload, extension: validReq.extension, title: validReq.title})
            .then((response: any) => {
                expect(response.statusCode).to.equal(HttpStatus.OK);
            });
    });

    it('should deny an invalid email', async () => {
        emailService.validateEmail.returns(false);
        const invalidEmail = 'johndoetest.com';
        return supertest(app)
            .post('/api/email')
            .send({to: invalidEmail, payload: validReq.payload, extension: validReq.extension, title: validReq.title})
            .then((response: any) => {
                expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
            });
    });

    it('should deny an invalid extension', async () => {
        emailService.validateExtension.returns(false);
        const invalidExtension = 'mp3';
        return supertest(app)
            .post('/api/email')
            .send({to: validReq.to, payload: validReq.payload, extension: invalidExtension, title: validReq.title})
            .then((response: any) => {
                expect(response.statusCode).to.equal(HttpStatus.UNPROCESSABLE);
            });
    });

    it('should deny an missing payload', async () => {
        return supertest(app)
            .post('/api/email')
            .send({to: validReq.to, extension: validReq.extension, title: validReq.title})
            .then((response: any) => {
                expect(response.statusCode).to.equal(HttpStatus.UNPROCESSABLE);
            });
    });

    it('should deny an missing title', async () => {
        return supertest(app)
            .post('/api/email')
            .send({to: validReq.to, payload: validReq.payload, extension: validReq.extension})
            .then((response: any) => {
                expect(response.statusCode).to.equal(HttpStatus.UNPROCESSABLE);
            });
    });

    it('should forward an error from Mail API', async () => {
        emailService.sendEmail.throws(new Error());
        return supertest(app)
            .post('/api/email')
            .send({to: validReq.to, payload: validReq.payload, extension: validReq.extension, title: validReq.title})
            .then((response: any) => {
                // do nothing
            })
            .catch((error: Error) => {
                expect(error);
            });
    });
});
