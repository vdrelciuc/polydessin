import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Image } from '../interfaces/image';
import { ImageService } from '../services/image.service';
import Types from '../types';

@injectable()
export class ImageController {
    router: Router;

    constructor(@inject(Types.ImageService) private imageService: ImageService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            this.imageService.getAllImages()
            .then((images: Image[]) => {
                res.json(images);
            })
            .catch((error: Error) => {
                res.status(Httpstatus.NOT_FOUND).send(error.message);
            });
        });

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            this.imageService.addImage(req.body)
                .then(() => {
                    res.sendStatus(Httpstatus.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });
    }
}
