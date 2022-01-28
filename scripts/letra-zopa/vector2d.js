/**
 * A vector with two dimensions.
 */
export class Vector2d {
    /**
     * @param x - horizontal component.
     * @param y - vertical component.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /** Returns a copy of this instance */
    copy() {
        return new Vector2d(this.x, this.y);
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /** @returns (-1) times this vector */
    minus() {
        return new Vector2d(-this.x, -this.y);
    }
    /**
     * Adds another vector to this instance.
     *
     * @returns whether it was successful or not.
     */
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return true;
    }
    equals(v) {
        return this.x === v.x && this.y === v.y;
    }
}
/** Meant for iterating over the keys of a Vector2d. */
Vector2d.axes = ['x', 'y'];
/**
 * A vector with two dimensions and css units.
 */
export class Vector2dCssUnit extends Vector2d {
    constructor(x, y, unitX = 'px', unitY = 'px') {
        super(x, y);
        this.units = { x: unitX, y: unitY };
    }
    /** Returns a copy of this instance */
    copy() {
        return new Vector2dCssUnit(this.x, this.y, this.units.x, this.units.y);
    }
    /**
     * Adds another vector to this instance.
     *
     * @returns whether it was successful or not.
     */
    add(v) {
        if (this.units.x !== v.units.x || this.units.y !== v.units.y) {
            return false;
        }
        return super.add(v);
    }
    equals(v) {
        return super.equals(v) && this.units.x === v.units.x && this.units.y === v.units.y;
    }
}
