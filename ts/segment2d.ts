import {Vector2d, Vector2dCssUnit} from './vector2d.js';
import {CssDistanceUnit} from './css-distance-unit.js';

/**
 * Represents a segment on a plane. This segment has a direction.
 */
export class Segment2d {

  /** Meant for iterating over the keys of a Segment. */
  static readonly ends: ['start', 'end'] = ['start', 'end'];

  /** The origin of the segment. */
  start: Vector2d;

  /** The ending point of the segment. */
  end: Vector2d;

  constructor(s2d: {
    start: Vector2d,
    end: Vector2d
  }) {
    this.start = s2d.start.copy();
    this.end = s2d.end.copy();
  }

  /** A copy of this segment, but starting in the end, and ending in the start. */
  get reversed() {
    return new Segment2d({start: this.end.copy(), end: this.start.copy()})
  }

  /** Vector from the start of the segment to the end */
  get vector(): Vector2d {
    return new Vector2d(this.end.x - this.start.x, this.end.y - this.start.y);
  }

  get length(): number {
    return this.vector.length;
  }

  copy(): Segment2d {
    return new Segment2d(this);
  }


  /**
   * Cuts whatever exceeds below zero (0) from itself, in both dimensions.
   */
  bindBelowByZero(): void {

    // iterate over ends, and get the other end too.
    for (const end of Segment2d.ends) {
      const otherEnd: keyof Segment2d = end === Segment2d.ends[0] ? Segment2d.ends[1] : Segment2d.ends[0];

      // vector from otherEnd to end
      const freeVector: Vector2d = new Vector2d(
        this[end].x - this[otherEnd].x,
        this[end].y - this[otherEnd].y
      );

      // iterate over axes, and get the other axis too.
      for (const axis of Vector2d.axes) {
        if (this[end][axis] < 0) {
          const otherAxis: keyof Vector2d = axis === Vector2d.axes[0] ? Vector2d.axes[1] : Vector2d.axes[0];

          // we modify freeVector first
          freeVector[otherAxis] += Math.sign(freeVector[otherAxis]) * this[end][axis];
          freeVector[axis] -= this[end][axis];

          // Cutting in axis is simple
          this[end][axis] = 0;

          // otherAxis must be cut too, the segment might be diagonal
          this[end][otherAxis] = this[otherEnd][otherAxis] + freeVector[otherAxis];
        }
      }

    }
  };


  /**
   * Cut from itself whatever exceeds above (towards infinity) the respective component of the vector.
   *
   * @param vector - Maximum allowed components.
   */
  bindAboveByVector(vector: Vector2d): void {

    // Transform the segment to use bindBelowByZero for binding
    for (const end of Segment2d.ends) {
      for (const axis of Vector2d.axes) {
        this[end][axis] = -this[end][axis] + vector[axis];
      }
    }
    // Use bindBelowByZero
    this.bindBelowByZero();

    // Transform back
    for (const end of Segment2d.ends) {
      for (const axis of Vector2d.axes) {
        this[end][axis] = -this[end][axis] + vector[axis];
      }
    }
  };

  /**
   * For rounding the segment to the nearest integers.
   */
  roundPosition(): void {
    for (const end of Segment2d.ends) {
      for (const axis of Vector2d.axes) {
        this[end][axis] = Math.round(this[end][axis]);
      }
    }
  }

  /**
   * For rounding the start to the nearest integers.
   */
  roundStart(): void {
    for (const axis of Vector2d.axes) {
      this.start[axis] = Math.round(this.start[axis]);
    }
  }

  /**
   * For rounding the end to the nearest integers.
   */
  roundEnd(): void {
    for (const axis of Vector2d.axes) {
      this.end[axis] = Math.round(this.end[axis]);
    }
  }

  /**
   * For rounding the segment to the nearest integer and to an angle multiple of 45deg.
   */
  roundPositionAndAngle(): void {
    this.roundStart();
    const length = this.vector.length;

    // Round its angle to nearest 45deg multiple
    const angle = Math.round(
      (Math.atan2(this.vector.y, this.vector.x) || 0) * 4 / Math.PI
    ) * Math.PI / 4;
    // Assign that angle to the segment, while keeping start untouched.
    this.end = new Vector2d(
      this.start.x + length * Math.cos(angle),
      this.start.y + length * Math.sin(angle)
    )
    this.roundEnd();
  }

  equals(s: Segment2d): boolean {
    return s.start.equals(this.start) && s.end.equals(this.end);
  }
}

/**
 * Represents a segment on a document. This segment has a direction, and a css unit.
 */
export class Segment2dCssUnit extends Segment2d {

  units: {
    x: CssDistanceUnit;
    y: CssDistanceUnit;
  };

  constructor(s2dcu: {
    start: Vector2d,
    end: Vector2d,
    units: { x: CssDistanceUnit, y: CssDistanceUnit }
  }) {
    super(s2dcu);
    this.units = {x: s2dcu.units.x, y: s2dcu.units.y};
  }

  /** Vector from the start of the segment to the end */
  get vector(): Vector2dCssUnit {
    return new Vector2dCssUnit(this.end.x - this.start.x, this.end.y - this.start.y, this.units.x, this.units.y);
  }

  equals(s: Segment2dCssUnit): boolean {
    return super.equals(s) && this.units.x === s.units.x && s.units.y === this.units.y;
  }
}
