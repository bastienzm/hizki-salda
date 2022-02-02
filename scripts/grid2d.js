import { Vector2d } from './vector2d.js';
/**
 * Represents a 2d rectangular grid, in a plane, made of squares.
 */
export class Grid2d {
    constructor(grid) {
        if ('start' in grid) {
            this.start = grid.start;
            this.blankSpace = grid.blankSpace;
            this.quantity = grid.quantity;
        }
        else {
            this.start = new Vector2d(0, 0);
            this.blankSpace = { length: 0 };
            this.quantity = new Vector2d(0, 0);
        }
    }
    /** Returns a copy of this instance */
    copy() {
        return new Grid2d({
            start: this.start.copy(),
            blankSpace: { length: this.blankSpace.length },
            quantity: this.quantity.copy()
        });
    }
}
/**
 * Represents a 2d rectangular grid, made of squares,  in a document, with css units.
 */
export class Grid2dCssUnit extends Grid2d {
    constructor(grid) {
        super(grid);
        if ('start' in grid) {
            this.blankSpace.unit = 'start' in grid ? grid.blankSpace.unit : 'px';
        }
    }
    /** Returns a copy of this instance */
    copy() {
        return new Grid2dCssUnit({
            start: this.start.copy(),
            blankSpace: { length: this.blankSpace.length, unit: this.blankSpace.unit },
            quantity: this.quantity.copy()
        });
    }
}
