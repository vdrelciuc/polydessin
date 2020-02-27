import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
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
            res.json(this.imageService.about());
        });
    }
}
