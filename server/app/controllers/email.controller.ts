import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatus } from '../enums/http-status';
import { EmailService } from '../services/email.service';
import { ImageService } from '../services/image.service';
import Types from '../types';

@injectable()
export class EmailController {
    router: Router;

    constructor(@inject(Types.EmailService) private emailService: EmailService,
                @inject(Types.ImageService) private imageService: ImageService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            const validEmail = this.emailService.validateEmail(req.body.to);
            const validTitle = this.imageService.validateTitle(req.body.title);
            const validExtension = this.emailService.validateExtension(req.body.extension);

            if (!validEmail || req.body.to === undefined) {
                res.status(HttpStatus.BAD_REQUEST).send('Adresse courriel invalide ou manquante');
            } else if (!validTitle || req.body.title === undefined) {
                res.status(HttpStatus.UNPROCESSABLE).send('Titre d\'image invalide ou manquant');
            } else if (!validExtension || req.body.extension === undefined) {
                res.status(HttpStatus.UNPROCESSABLE).send('Extension invalide ou manquante');
            } else if (req.body.payload === undefined) {
                res.status(HttpStatus.UNPROCESSABLE).send('Fichier joint manquant');
            } else {
                this.emailService.sendEmail(req.body.to, req.body.payload, req.body.extension, req.body.title)
                    .then((status: number) => {
                        let message = '';
                        switch (status) {
                            case HttpStatus.OK:
                                message = 'Envoi réussi';
                                break;
                            case HttpStatus.BAD_REQUEST:
                                message = 'Adresse courriel invalide';
                                break;
                            case HttpStatus.FORBIDDEN:
                                message = 'Clé API manquante ou invalide';
                                break;
                            case HttpStatus.UNPROCESSABLE:
                                message = 'Adresse courriel ou fichier joint manquant';
                                break;
                            case HttpStatus.TOO_MANY:
                                message = 'Quota d\'envoi de courriels dépassé';
                                break;
                            case HttpStatus.INTERNAL_ERROR:
                                message = 'Erreur interne au serveur d\'envoi';
                                break;
                        }
                        res.status(status).send(message);
                    })
                    .catch((error: Error) => {
                            res.status(HttpStatus.BAD_REQUEST).send(error.message);
                    });
            }

        });
    }
}
