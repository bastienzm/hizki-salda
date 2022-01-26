import { Grid2dCssUnit } from './grid2d.js';
import { Segment2d } from './segment2d.js';
import { Vector2d } from './vector2d.js';
/**
 * The div element used to render a segment in the grid.
 */
export class StadiumInGrid {
    constructor(g2dcu) {
        this.x = 0;
        this.span = document.createElement('span');
        this.span.id = `s${this.id}`;
        this.innerSegment = new Segment2d({
            start: new Vector2d(0, 0),
            end: new Vector2d(0, 0)
        });
        if (document.querySelectorAll('style').length === 0) {
            const style = document.createElement('style');
            style.textContent = `
        span {
          position: absolute;
          border: 2px solid black;
        }
      `;
            document.head.appendChild(style);
        }
        this.grid = new Grid2dCssUnit(g2dcu);
    }
    /** @returns The position of itself on the grid */
    get segment() {
        return this.innerSegment.copy();
    }
    /** @param segment - The future position of itself on the grid. */
    set segment(segment) {
        this.innerSegment = segment.copy();
        this.updateSegment();
    }
    get grid() {
        return this.innerGrid.copy();
    }
    set grid(grid) {
        this.innerGrid = grid.copy();
        this.innerRadius = 0.45 * this.innerGrid.blankSpace.length;
        if (this.segment) {
            this.innerSegment.bindAboveByVector(this.innerGrid.quantity);
        }
        this.updateAll();
    }
    updateSegment() {
        this.innerSegment.roundPositionAndAngle();
        this.innerSegment.bindBelowByZero();
        if (this.innerGrid) {
            this.innerSegment.bindAboveByVector(this.innerGrid.quantity);
        }
        this.updateAll();
    }
    updateStyle() {
        this.x += 1;
        if (this.x > 40) {
            this.x = 0;
        }
        this.span.style.cssText = `
      display: ${this.innerGrid && this.innerRadius ? 'block' : 'none'};
      ${this.innerGrid && this.innerRadius
            ?
                `
            transform-origin: ${this.innerRadius + this.innerGrid.blankSpace.unit
                    + ' '
                    + this.innerRadius + this.innerGrid.blankSpace.unit};
            border-radius: ${this.innerRadius + this.innerGrid.blankSpace.unit};
            height: ${2 * this.innerRadius + this.innerGrid.blankSpace.unit};
            ${this.innerSegment
                    ?
                        `
                  left: calc(${window.innerWidth > window.innerHeight
                            ? (window.innerWidth - window.innerHeight) / 2
                            : 0}px
                        + ${this.innerGrid.start.x + this.innerGrid.start.units.x}
                        + ${(this.innerGrid.blankSpace.length * this.innerSegment.start.x)
                            + this.innerGrid.blankSpace.unit});

                  top: calc(${window.innerHeight > window.innerWidth
                            ? (window.innerHeight - window.innerWidth) / 2
                            : 0}px
                       + ${this.innerGrid.start.y + this.innerGrid.start.units.y}
                       + ${(this.innerGrid.blankSpace.length * this.innerSegment.start.y)
                            + this.innerGrid.blankSpace.unit});

                  width: ${this.innerSegment.length * this.innerGrid.blankSpace.length + 2 * this.innerRadius
                            + this.innerGrid.blankSpace.unit};

                  transform: translate(
                    calc(-${this.innerRadius}${this.innerGrid.blankSpace.unit}),
                    calc(-${this.innerRadius}${this.innerGrid.blankSpace.unit})
                  ) rotate(${Math.atan2(this.innerSegment.vector.y, this.innerSegment.vector.x)}rad);
                
                `
                    :
                        ''}
          `
            :
                ''}
    `;
    }
    updateAll() {
        this.updateStyle();
    }
}
