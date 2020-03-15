import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatus } from '../enums/http-status';
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
                res.status(HttpStatus.NOT_FOUND).send(error.message);
            });
        });

        this.router.get('/:imageId', async (req: Request, res: Response, next: NextFunction) => {
            this.imageService.getImage(req.params.imageId)
                .then((image: Image) => {
                    res.json(image);
                })
                .catch((error: Error) => {
                    res.status(HttpStatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            this.imageService.addImage(req.body)
                .then(() => {
                    res.sendStatus(HttpStatus.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(HttpStatus.BAD_REQUEST).send(error.message);
                });
        });

        this.router.delete('/:imageId', async (req: Request, res: Response, next: NextFunction) => {
            this.imageService.deleteImage(req.params.imageId)
                .then(() => {
                    res.sendStatus(HttpStatus.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    if (error.message === 'Cannot remove headers after they are sent to the client') {
                        // ignore this error
                    } else {
                        res.status(HttpStatus.NOT_FOUND).send(error.message);
                    }
                });
        });
    }
}
