import { CoordinatesXY } from './coordinates-x-y';
import { Color } from './color';
import * as CONSTANTS from './constants';

export class BFSAlgorithm {
    pathsToFill: CoordinatesXY[][];
    private width: number;
    private height: number;
    private context2D: CanvasRenderingContext2D;
    private visited: Set<string>;
    private queue: CoordinatesXY[];
    private strokes: CoordinatesXY[];
    private strokesSet: Set<string>;
    private tolerance: number;
    private data: Uint8ClampedArray;
    private tmpPath: CoordinatesXY[];

    constructor(
        width: number,
        height: number,
        context2D: CanvasRenderingContext2D,
        tolerance: number,
    ) {
        this.width = width;
        this.height = height;
        this.context2D = context2D;
        this.visited = new Set([]);
        this.queue = [];
        this.strokes = [];
        this.strokesSet = new Set([]);  
        this.tolerance = tolerance;
    }

    BFS(clickPosition: CoordinatesXY): void {
        this.data = this.context2D.getImageData(0, 0, this.width, this.height).data;

        const targetColor: Color = this.getPixelColor(clickPosition);
        this.queue.push(clickPosition);

        while (this.queue.length > 0) {
            const pixel: CoordinatesXY = this.queue.pop() as CoordinatesXY;

            if (!targetColor.isSimilarWithTolerance(this.getPixelColor(pixel), this.tolerance)) {
                continue;
            }

            const neighborPixels = [
                new CoordinatesXY(pixel.getX() - 1, pixel.getY()),
                new CoordinatesXY(pixel.getX() + 1, pixel.getY()),
                new CoordinatesXY(pixel.getX(),     pixel.getY() - 1),
                new CoordinatesXY(pixel.getX(),     pixel.getY() + 1),
            ];

            for (const neighborPixel of neighborPixels) {
                if (this.visited.has(`${neighborPixel.getX()} ${neighborPixel.getY()}`)) {
                    continue;
                }
                if (!this.isValidPosition(neighborPixel)) {
                    this.strokes.push(pixel);
                    this.strokesSet.add(`${pixel.getX()} ${pixel.getY()}`);
                    break;
                }
                if (targetColor.isSimilarWithTolerance(this.getPixelColor(neighborPixel), this.tolerance)) {
                    this.queue.push(neighborPixel);
                    this.visited.add(`${neighborPixel.getX()} ${neighborPixel.getY()}`);
                } else {
                    this.strokes.push(neighborPixel);
                    this.strokesSet.add(`${neighborPixel.getX()} ${neighborPixel.getY()}`);
                    break;
                }
            }
        }
        this.createPathToFill();
    }

    private searchIn(neighborPixels: CoordinatesXY[], closestNeighbor: CoordinatesXY): void {
        neighborPixels.forEach((neighborPixel: CoordinatesXY) => {
            if (
                this.strokesSet.has(`${neighborPixel.getX()} ${neighborPixel.getY()}`) &&
                !this.visited.has(`${neighborPixel.getX()} ${neighborPixel.getY()}`)
            ) {
                closestNeighbor.setX(neighborPixel.getX());
                closestNeighbor.setY(neighborPixel.getY());
            }
        });
    }

    private searchInDirectNeighbors(pixel: CoordinatesXY, closestNeighbor: CoordinatesXY): void {
        const neighborPixels = [
            new CoordinatesXY(pixel.getX() - 1, pixel.getY()),
            new CoordinatesXY(pixel.getX() + 1, pixel.getY()),
            new CoordinatesXY(pixel.getX(),     pixel.getY() - 1),
            new CoordinatesXY(pixel.getX(),     pixel.getY() + 1),
        ];
        this.searchIn(neighborPixels, closestNeighbor);
    }

    private searchInIndirectNeighbors(pixel: CoordinatesXY, closestNeighbor: CoordinatesXY): void {
        const neighborPixels = [
            new CoordinatesXY(pixel.getX() - 1, pixel.getY() - 1),
            new CoordinatesXY(pixel.getX() - 1, pixel.getY() + 1),
            new CoordinatesXY(pixel.getX() + 1, pixel.getY() - 1),
            new CoordinatesXY(pixel.getX() + 1, pixel.getY() + 1),
        ];
        this.searchIn(neighborPixels, closestNeighbor);
    }

    private findClosestPixel(pixel: CoordinatesXY, closestNeighbor: CoordinatesXY): void {
        let closestNeighborDistance = Number.MAX_SAFE_INTEGER;
        this.strokes.forEach((el: CoordinatesXY) => {
            if (!this.visited.has(`${el.getX()} ${el.getY()}`)) {
                const distance = el.distanceTo(pixel);
                if (distance < closestNeighborDistance) {
                    closestNeighborDistance = distance;
                    closestNeighbor.setX(el.getX());
                    closestNeighbor.setY(el.getY());
                }
            }
        });

        if (closestNeighborDistance > 100 && this.tmpPath.length > 0) {
            this.pathsToFill.push(this.tmpPath);
            this.tmpPath = [];
        }
    }

    private updateClosestNeighbor(pixel: CoordinatesXY, closestNeighbor: CoordinatesXY): void {
        this.searchInDirectNeighbors(pixel, closestNeighbor);
        if (!(closestNeighbor.getX() >= 0 && closestNeighbor.getY() >= 0)) {
            this.searchInIndirectNeighbors(pixel, closestNeighbor);
            this.findClosestPixel(pixel, closestNeighbor);
        }
    }

    private createPathToFill() {
        if (this.strokes.length !== 0) {
            this.pathsToFill = [];
            this.visited = new Set([]);
            this.tmpPath = [];

            const pixel: CoordinatesXY = this.strokes[0];
            this.visited.add(`${pixel.getX()} ${pixel.getY()}`);

            while ((pixel.getX() >= 0 && pixel.getY() >= 0)) {
                this.tmpPath.push(pixel.clone());

                const closestNeighbor: CoordinatesXY = new CoordinatesXY(-1, -1);
                this.updateClosestNeighbor(pixel, closestNeighbor);

                this.visited.add(`${closestNeighbor.getX()} ${closestNeighbor.getY()}`);
                pixel.setX(closestNeighbor.getX());
                pixel.setY(closestNeighbor.getY());
            }

            this.pathsToFill.push(this.tmpPath);
            this.tmpPath = [];
        }
    }

    private isValidPosition(pixel: CoordinatesXY): boolean {
        return (
            pixel.getX() >= 0           && 
            pixel.getX() <  this.width  && 
            pixel.getY() >= 0           && 
            pixel.getY() <  this.height
        );
    }

    private getPixelColor(pixel: CoordinatesXY): Color {
        let index: number = (CONSTANTS.BYTES_IN_HEX + 1) * (pixel.getX() + pixel.getY() * this.width);
        return new Color([
            this.data[index++], 
            this.data[index++], 
            this.data[index]
        ]);
    }
}
