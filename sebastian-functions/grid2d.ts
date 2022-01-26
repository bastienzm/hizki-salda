import {Vector2d, Vector2dCssUnit} from './vector2d.js';
import {CssDistanceUnit} from './css-distance-unit.js';

/**
 * Represents a 2d rectangular grid, in a plane, made of squares.
 */
export class Grid2d {

  /** The point of the grid that is closest to minus (-) infinity, in both axes. */
  start: Vector2d;

  /** The distance between points next to each other, the same in both axes. */
  blankSpace: {
    length: number;
  };

  /** Each component is the quantity of points on the axis of the component. */
  quantity: Vector2d;

  constructor(grid?: {
    start: Vector2d;
    blankSpace: {length: number};
    quantity: Vector2d;
  }) {
    if ('start' in grid) {
      this.start = grid.start;
      this.blankSpace = grid.blankSpace;
      this.quantity = grid.quantity;
    }
    else {
      this.start = new Vector2d(0, 0);
      this.blankSpace = {length: 0};
      this.quantity = new Vector2d(0, 0);
    }
  }

  /** Returns a copy of this instance */
  copy(): Grid2d {
    return new Grid2d({
      start: this.start.copy(),
      blankSpace: {length: this.blankSpace.length},
      quantity: this.quantity.copy()
    });
  }
}

/**
 * Represents a 2d rectangular grid, made of squares,  in a document, with css units.
 */
export class Grid2dCssUnit extends Grid2d {

  /** The point of the grid that is closest to minus (-) infinity, in both axes, with css units */
  start: Vector2dCssUnit;

  /** The distance between points next to each other, the same in both axes, with a css unit. */
  blankSpace: {
    length: number;
    unit: CssDistanceUnit;
  };

  constructor(grid?: {
    start: Vector2dCssUnit;
    blankSpace: {length: number; unit: CssDistanceUnit};
    quantity: Vector2d;
  }) {
    super(grid);
    if ('start' in grid) {
      this.blankSpace.unit = 'start' in grid ? grid.blankSpace.unit : 'px';
    }
  }

  /** Returns a copy of this instance */
  copy(): Grid2dCssUnit {
    return new Grid2dCssUnit({
      start: this.start.copy(),
      blankSpace: {length: this.blankSpace.length, unit: this.blankSpace.unit},
      quantity: this.quantity.copy()
    });
  }
}
