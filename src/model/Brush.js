export default class Brush {

    constructor (gfx, pixmap) {
        this._pixmap = pixmap;
        this._pattern = gfx.createPattern(pixmap.canvas, "repeat");
    }

    get pattern() {
        return this._pattern;
    }

    get pixmap() {
        return this._pixmap;
    }
}