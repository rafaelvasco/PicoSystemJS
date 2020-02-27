import EventEmitter from "../../model/EventEmitter";

export default class CanvasControl extends EventEmitter {

    constructor (params) {
        super();
        this._canvasElementParent = params.parent;
        this._bounds = params.bounds;
        this._style = params.style;
        this._hovered = false;
    }

    get style() {
        return this._style;
    }

    get bounds() {
        return this._bounds;
    }

    get parent() {
        return this._canvasElementParent;
    }

    refresh() {
        this._canvasElementParent.paint();
    }

    hitPoint(x, y) {
        return this.bounds.containsPoint(x, y);
    }

    onMouseDown(button, x, y) {}

    onMouseUp(button, x, y) {}

    onMouseMove(x, y) {}

    onMouseEnter() {}

    onMouseLeave() {}

    paint(g) {

    }
}