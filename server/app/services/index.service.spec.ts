/*import { expect } from 'chai';
import { Message } from '../../../common/communication/message';
import { Stubbed, testingContainer } from '../../test/test-utils';
import Types from '../types';
import { DateService } from './date.service';
import { IndexService } from './index.service';

describe('Index service', () => {
    let indexService: IndexService;
    let dateService: Stubbed<DateService>;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.DateService).toConstantValue({
            currentTime: sandbox.stub().resolves({
                title: 'Time',
                body: new Date(2020, 0, 10).toString(),
            }),
        });
        dateService = container.get(Types.DateService);
        indexService = container.get<IndexService>(Types.IndexService);
    });

    it('should return a simple message if #about is called', () => {
        const expectedTitle = 'This is merely a test';
        const expectedBody = 'Lorem ipsum........';
        const aboutMessage = indexService.about();
        expect(aboutMessage.title).to.equals(expectedTitle);
        expect(aboutMessage.body).to.equals(expectedBody);
    });

    it('should return Hello World as title', (done: Mocha.Done) => {
        indexService.helloWorld().then((result: Message) => {
            expect(result.title).to.equals('Hello world');
            done();
        });
    });

    it('should have a body that starts with "Time is"', (done: Mocha.Done) => {
        indexService.helloWorld().then((result: Message) => {
            expect(result.body)
                .to.be.a('string')
                .and.satisfy((body: string) => body.startsWith('Time is'));
            done();
        });
    });

    it('should handle an error from DateService', (done: Mocha.Done) => {
        dateService.currentTime.rejects(new Error('error in the service'));
        indexService
            .helloWorld()
            .then((result: Message) => {
                expect(result.title).to.equals('Error');
                done();
            })
            .catch((error: unknown) => {
                done(error);
            });
    });
});*/
