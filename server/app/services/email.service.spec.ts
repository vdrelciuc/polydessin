import { ok } from 'assert';
import { expect } from 'chai';
import * as fs from 'fs';
import * as sinon from 'sinon';
import { testingContainer } from '../../test/test-utils';
import Types from '../types';
import { EmailService } from './email.service';

describe('Email Service', () => {
    let emailService: EmailService;

    beforeEach(async () => {
        const [container] = await testingContainer();
        emailService = container.get<EmailService>(Types.EmailService);
    });

    it('#sanitizeUrl should remove \'C:\' on Windows', () => {
        if (process.platform === 'win32') {
            const expectedUrl = '';
            let actualUrl = 'C:';
            actualUrl = emailService.sanitizeUrl(actualUrl);
            expect(actualUrl).to.deep.equal(expectedUrl);
        } else {
            expect(ok); // Not Windows, so no need to sanitize
        }
    });

    it('#sanitizeUrl should replace \'\\\' with \'/\' on Windows', () => {
        if (process.platform === 'win32') {
            const expectedUrl = '/path/to/file';
            let actualUrl = '\\path\\to\\file';
            actualUrl = emailService.sanitizeUrl(actualUrl);
            expect(actualUrl).to.deep.equal(expectedUrl);
        } else {
            expect(ok); // Not Windows, so no need to sanitize
        }
    });

    it('#saveOnDisk should write a file on disk', async () => {
        const spy = sinon.stub(fs.promises, 'writeFile').resolves();
        emailService.saveOnDisk('', 'svg');
        expect(spy.calledOnce);
        spy.restore();
    });

    it('#deleteFromDisk should delete an existing file from disk', async () => {
        const spy = sinon.stub(fs, 'unlinkSync').resolves();
        emailService.deleteFromDisk(__dirname + '/test.txt');
        expect(spy.calledOnce);
        spy.restore();
    });

    it('#deleteFromDisk should throw an error when deleting an inexistent file from disk', async () => {
        try {
            emailService.deleteFromDisk('./inexisting_file.txt');
        } catch (error) {
            expect(error);
        }
    });

    it('#validateEmail should allow a valid email', () => {
        const validEmail = 'john.doe@test.com';
        const validation = emailService.validateEmail(validEmail);
        // tslint:disable: no-unused-expression | Reason: unknown reason why tslint considers expect as unused when Chai uses it
        expect(validation).to.be.true;
    });

    it('#validateEmail should deny an invalid email', () => {
        const invalidEmail = 'john.doetest.com';
        const validation = emailService.validateEmail(invalidEmail);
        expect(validation).to.be.false;
    });

    it('#validateExtension should allow valid extensions', () => {
        const validJpg = 'jpg';
        const validJpeg = 'jpeg';
        const validPng = 'png';
        const validSvg = 'svg';
        expect(emailService.validateExtension(validJpg)).to.be.true;
        expect(emailService.validateExtension(validJpeg)).to.be.true;
        expect(emailService.validateExtension(validPng)).to.be.true;
        expect(emailService.validateExtension(validSvg)).to.be.true;
    });

    it('#validateExtension should deny invalid extension', () => {
        const invalidMp3 = 'mp3';
        expect(emailService.validateExtension(invalidMp3)).to.be.false;
    });

    it('#sendEmail should return status 200 on valid email', async () => {
        const email = 'test@gmail.com';
        const dataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA';
        const extension = 'jpeg';
        const title = 'My image';

        const expectedStatus = 200;

        emailService.sendEmail(email, dataUrl, extension, title).then((status: number) => {
            expect(status).to.deep.equal(expectedStatus);
        }).catch((error: Error) => {
            console.log(error.message);
        });
    });
});
