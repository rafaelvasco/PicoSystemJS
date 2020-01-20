import Element from "./Element";

export default class CanvasElement extends Element {
    constructor(id, width, height) {
        super(id);
        this._width = width;
        this._height = height;

        this._canvas = document.createElement("canvas");
        this._canvas.setAttribute('id', this.id);
        this._canvas.width = width;
        this._canvas.height = height;

        this._canvas.addEventListener(
            "mousedown",
            e => {
                this.onMouseDown(e);
            },
            false
        );
        this._canvas.addEventListener(
            "mouseup",
            e => {
                this.onMouseUp(e);
            },
            false
        );

        this._canvas.addEventListener(
            "mousemove",
            e => {
                this.onMouseMove(e);
            },
            false
        );
        this._canvas.addEventListener(
            "wheel",
            e => {
                this.onMouseWheel(e);
            },
            false
        );
        this._canvas.addEventListener(
            "mouseenter",
            e => this.onMouseEnter(e),
            false
        );
        this._canvas.addEventListener(
            "mouseout",
            e => this.onMouseLeave(e),
            false
        );

        this._gfx = this._canvas.getContext("2d", {
            alpha: true,
            depth: false,
            antialias: false
        });
        this._gfx.imageSmoothingEnabled = false;
    }

    get canvas() {
        return this._canvas;
    }

    get gfx() {
        return this._gfx;
    }

    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }

    get root() {
        return this._canvas;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._canvas.width = width;
        this._canvas.height = height;

        this._gfx.imageSmoothingEnabled = false;
    }

    clear() {
        this._gfx.clearRect(0, 0, this._width, this._height);
    }

    paint() {}

    onMouseDown(e) {
        return;
    }

    onMouseUp(e) {
        return;
    }

    onMouseMove(e) {
        return;
    }

    onMouseWheel(e) {
        return;
    }

    onMouseEnter(e) {
        return;
    }

    onMouseLeave(e) {
        return;
    }
}
