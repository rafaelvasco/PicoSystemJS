import Element from "./Element";

export default class CanvasElement extends Element {
    constructor(id, width, height, transparent) {

        super({
            id: id,
            elementTag: 'canvas'
        });

        this.domElement.width = width;
        this.domElement.height = height;
        this._canvasControls = [];
        this._lastHoveredControl = null;
        
        this.on('mousedown', (e) => {
            this.onMouseDown(e);
        });

        this.on('mouseup', (e) => {
            this.onMouseUp(e);
        });

        this.on('mousemove', (e) => {
            this.onMouseMove(e);
        });

        this.on('wheel', (e) => {
            this.onMouseWheel(e);
        });

        this.on('mouseenter', (e) => {
            this.onMouseEnter(e);
        });
        
        this.on('mouseout', (e) => {
            this.onMouseLeave(e);
        });

        this._gfx = this.domElement.getContext("2d", {
            alpha: transparent === true
        });
        this._gfx.imageSmoothingEnabled = false;
    }

    get canvas() {
        return this.domElement;
    }

    get gfx() {
        return this._gfx;
    }

    resize(width, height) {
        super.resize(width, height);
        this._gfx.imageSmoothingEnabled = false;
    }

    addControl(canvasControl) {
        this._canvasControls.push(canvasControl);
    }

    clear() {
        this._gfx.clearRect(0, 0, this._width, this._height);
    }

    paint() {
        for(let i = 0; i < this._canvasControls.length; ++i) {
            this._canvasControls[i].paint(this._gfx);
        }
    }

    onMouseDown(e) {
        e.preventDefault();
        for(let i = 0; i < this._canvasControls.length; ++i) {
            const control = this._canvasControls[i];    
            if (control._hovered === true) {
                if (control.onMouseDown(e.button, e.offsetX, e.offsetY)) {
                    this.paint();
                    return;
                }
            }
        }
    }

    onMouseUp(e) {
        e.preventDefault();
        for(let i = 0; i < this._canvasControls.length; ++i) {
            const control = this._canvasControls[i];    
            if (control._hovered === true) {
                if (control.onMouseUp(e.button, e.offsetX, e.offsetY)) {
                    this.paint();
                    return;
                }
            }
        }
    }

    onMouseMove(e) {
        e.preventDefault();
        const x = e.offsetX;
        const y = e.offsetY;
        for(let i = 0; i < this._canvasControls.length; ++i) {
            const control = this._canvasControls[i];    
            if (control.onMouseMove(x, y)) {
                this.paint();
            }
            if(control._hovered === false && control.hitPoint(x, y)) {
                if (this._lastHoveredControl) {
                    this._lastHoveredControl._hovered = false;
                    this._lastHoveredControl = null;
                }
                control.onMouseEnter();
                control._hovered = true;
                this._lastHoveredControl = control;
            }
            else if (control._hovered === true && !control.hitPoint(x, y)) {
                control.onMouseLeave();
                control._hovered = false;
                if (this._lastHoveredControl && this._lastHoveredControl === control) {
                    this._lastHoveredControl = null;
                }
            }
        }
    }

    onMouseWheel(e) {
        e.preventDefault();
        for(let i = 0; i < this._canvasControls.length; ++i) {
            const control = this._canvasControls[i];    
            if (control.onMouseWheel(e.deltaY)) {
                this.paint();
                return;
            }
        }
    }

    onMouseEnter(e) {
        return;
    }

    onMouseLeave(e) {
        e.preventDefault();
        for(let i = 0; i < this._canvasControls.length; ++i) {
            const control = this._canvasControls[i];    
            if (control.onMouseLeave()) {
                this.paint();
                return;
            }
        }
    }
}
