import { StadiumInGrid } from './stadium-in-grid.js';
import { Vector2d, Vector2dCssUnit } from './vector2d.js';
import { convertCssUnit as cu } from './convertCssUnit.js';
import { Segment2d } from './segment2d.js';
import { Grid2dCssUnit } from './grid2d.js';
let parent;
let rect;
let stg;
// parameter for StadiumInGrid constructor.
let stgParameter;
const oldStgs = [];
/*
let horizontal: boolean = parent.offsetWidth > parent.offsetHeight;
let extraSpace: number = Math.abs(parent.offsetWidth - parent.offsetHeight);
*/
// Here correct answers will be stored.
const answered = new Set();
// store answers in Segment2d array
const answer = (function (arr) {
    const ret = [];
    for (const seg of arr) {
        ret.push(new Segment2d({
            start: new Vector2d(seg[0], seg[1]),
            end: new Vector2d(seg[2], seg[3])
        }));
    }
    return ret;
})([[3, 0, 9, 0], [1, 1, 5, 1], [0, 3, 8, 3], [3, 4, 8, 4], [0, 5, 5, 5], [3, 8, 8, 8]]);
// We shall create variables for everyone to use here
// These variables are used to pas data between functions
const mousePosition = new Segment2d({ start: new Vector2d(0, 0), end: new Vector2d(0, 0) });
let mouseIsDown = false;
// update upper bar
const left = answer.length - answered.size;
const color = left == 0 ? 'success' : 'danger';
const target = document.querySelector('ion-badge');
target.setAttribute('color', color);
target.innerHTML = `${left}`;
window.addEventListener('resize', function () {
    rect = parent.getBoundingClientRect();
    stgParameter = {
        start: new Vector2dCssUnit(0.1 * rect.width, 0.1 * rect.height, 'px', 'px'),
        blankSpace: { length: 0.08 * rect.width, unit: 'px' },
        quantity: new Vector2d(10, 10)
    };
    const newGrid = new Grid2dCssUnit(stgParameter);
    for (const oldStg of oldStgs) {
        oldStg.grid = newGrid;
    }
    stg.grid = newGrid;
    stg.span.style.display = 'none';
});
window.addEventListener('load', function () {
    parent = document.querySelector('div.one-by-one.aspect-ratio');
    rect = parent.getBoundingClientRect();
    stgParameter = {
        start: new Vector2dCssUnit(0.1 * rect.width, 0.1 * rect.height, 'px', 'px'),
        blankSpace: { length: 0.08 * rect.width, unit: 'px' },
        quantity: new Vector2d(10, 10)
    };
    stg = new StadiumInGrid(stgParameter);
    // hide span, then put it in the body
    stg.span.style.display = 'none';
    parent.appendChild(stg.span);
    parent.addEventListener('pointermove', pointerMove);
    parent.addEventListener('pointerdown', pointerDown);
    parent.addEventListener('pointerup', pointerUp);
    parent.addEventListener('pointerout', pointerUp);
    parent.addEventListener('pointercancel', pointerUp);
});
function pointerMove(evt) {
    evt.preventDefault();
    if (mouseIsDown) {
        mousePosition.end = new Vector2d(evt.clientX - rect.left, evt.clientY - rect.top);
        convert(mousePosition.end, stg);
        stg.segment = mousePosition;
    }
}
function pointerDown(evt) {
    evt.preventDefault();
    // If it might be unintentional, return.
    if (evt.metaKey || evt.ctrlKey || evt.altKey || evt.shiftKey || (evt.buttons & 1) !== 1) {
        return;
    }
    mousePosition.start = new Vector2d(evt.clientX - rect.left, evt.clientY - rect.top);
    for (const axis of Vector2d.axes) {
        mousePosition.start[axis] = Math.max(mousePosition.start[axis], cu(stg.grid.start[axis] + stg.grid.start.units[axis], null));
        mousePosition.start[axis] = Math.min(mousePosition.start[axis], cu(stg.grid.start[axis] + stg.grid.start.units[axis], null)
            + cu(stg.grid.blankSpace.length * stg.grid.quantity[axis]
                + stg.grid.blankSpace.unit, null));
    }
    convert(mousePosition.start, stg);
    mousePosition.end = mousePosition.start.copy();
    stg.segment = mousePosition;
    mouseIsDown = true;
    stg.span.style.display = '';
}
function pointerUp(evt) {
    evt.preventDefault();
    if (!mouseIsDown) {
        return;
    }
    stg.segment = mousePosition;
    for (const [index, seg] of answer.entries()) {
        if (!answered.has(index)) {
            if (seg.equals(stg.segment.reversed)) {
                stg.segment = stg.segment.reversed;
            }
            if (seg.equals(stg.segment)) {
                answered.add(index);
                stg.setCorrect();
                oldStgs.push(stg);
                stg = new StadiumInGrid(stgParameter);
                // update upper bar
                const left = answer.length - answered.size;
                const color = left == 0 ? 'success' : 'danger';
                const target = document.querySelector('ion-badge');
                target.setAttribute('color', color);
                target.innerHTML = `${left}`;
                // Are we done?
                if (answered.size !== answer.length) {
                    // No, we are not done
                    stg.span.style.display = 'none';
                    parent.appendChild(stg.span);
                }
                else {
                    // Yes, we are done.
                }
                break;
            }
        }
    }
    stg.span.style.display = 'none';
    mouseIsDown = false;
}
function convert(rawEnd, stg) {
    for (const axis of Vector2d.axes) {
        rawEnd[axis] -= cu(stg.grid.start[axis] + stg.grid.start.units[axis], null);
        rawEnd[axis] /= cu(stg.grid.blankSpace.length + stg.grid.blankSpace.unit, null);
        rawEnd[axis] = Math.round(rawEnd[axis]);
    }
    return rawEnd;
}
