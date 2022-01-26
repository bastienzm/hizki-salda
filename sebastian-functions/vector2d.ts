
import {CssDistanceUnit} from './css-distance-unit.js';

/**
 * A vector with two dimensions.
 */
export class Vector2d {

  /** Meant for iterating over the keys of a Vector2d. */
  static readonly axes: ['x', 'y'] = ['x', 'y'];

  /** horizontal component. */
  x: number;

  /** vertical component. */
  y: number;


  /**
   * @param x - horizontal component.
   * @param y - vertical component.
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  /** Returns a copy of this instance */
  copy(): Vector2d {
    return new Vector2d(this.x, this.y);
  }

  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /** @returns (-1) times this vector */
  minus(): Vector2d {
    return new Vector2d(-this.x, -this.y);
  }
  /**
   * Adds another vector to this instance.
   *
   * @returns whether it was successful or not.
   */
  add(v: Vector2d): boolean {
    this.x += v.x;
    this.y += v.y;
    return true;
  }

  equals(v: Vector2d): boolean {
    return this.x === v.x && this.y === v.y;
  }
}


/**
 * A vector with two dimensions and css units.
 */
export class Vector2dCssUnit extends Vector2d {

  /** units for each of the axes */
  units: {x: CssDistanceUnit; y: CssDistanceUnit};

  constructor(x: number, y: number, unitX: CssDistanceUnit = 'px', unitY: CssDistanceUnit = 'px') {
    super(x, y);
    this.units = {x: unitX, y: unitY};
  }

  /** Returns a copy of this instance */
  copy(): Vector2dCssUnit {
    return new Vector2dCssUnit(this.x, this.y, this.units.x, this.units.y);
  }

  /**
   * Adds another vector to this instance.
   *
   * @returns whether it was successful or not.
   */
  add(v: Vector2dCssUnit): boolean {
    if (this.units.x !== v.units.x || this.units.y !== v.units.y) {
      return false;
    }
    return super.add(v);
  }

  equals(v: Vector2dCssUnit): boolean {
    return super.equals(v) && this.units.x === v.units.x && this.units.y === v.units.y
  }
}
