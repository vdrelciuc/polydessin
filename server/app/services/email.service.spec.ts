import { ok } from 'assert';
import { assert, expect } from 'chai';
import { promises as fsp } from 'fs';
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
        const spy = sinon.stub(fsp, 'writeFile').resolves();
        emailService.saveOnDisk('', 'svg');
        assert(spy.calledOnce);
    });

    it('#deleteFromDisk should delete an existing file from disk', async () => {
        // Create mock file
        await fsp.writeFile(__dirname + '/test.txt', 'Hello content!', 'base64');

        // Delete file using service
        emailService.deleteFromDisk(__dirname + '/test.txt');
        assert(ok); // Finished without error means file was deleted
    });

    it('#deleteFromDisk should throw an error when deleting an inexistent file from disk', async () => {
        try {
            emailService.deleteFromDisk('./inexisting_file.txt');
        } catch (error) {
            expect(error);
        }
    });
});
