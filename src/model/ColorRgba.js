export default class ColorRgba {

    constructor(r = 0, g = 0, b = 0, a = 255){

        this._components = [r, g, b, a];
    }

    get hexStr() {
        const r = this._components[0].toString(16);
        const g = this._components[1].toString(16);
        const b = this._components[2].toString(16);

        if (this._components[0] < 16) { r = '0' + r; }
        if (this._components[1] < 16) { g = '0' + g; }
        if (this._components[2] < 16) { b = '0' + b; }

        return `#${r}${g}${b}`.toUpperCase();
    }

    get array() {
        return this._components;
    }

    get rgbaStr() {
        return `rgba(${this._components[0]}, ${this._components[1]}, ${this._components[2]}, ${(Math.round(this._components[3] / 255 * 10))/10})`;
    }

    get red() {
        return this._components[0];
    }

    set red(val) {
        if (this._isValidRGBValue(val) === false) {
            return;
        }
        this._components[0] = val | 0;
    }

    get green() {
        return this._components[1];
    }

    set green(val) {
        if (this._isValidRGBValue(val) === false) {
            return;
        }
        this._components[1] = val | 0;
    }

    get blue() {
        return this._components[2];
    }

    set blue(val) {
        if (this._isValidRGBValue(val) === false) {
            return;
        }
        this._components[2] = val | 0;
    }

    get alpha() {
        return this._components[3];
    }

    set alpha(val) {
        if (this._isValidRGBValue(val) === false) {
            return;
        }
        this._components[3] = val | 0;
    }

    copy(obj) {
        
        if (obj instanceof ColorRgba === false) {
            console.error("Can't copy object other than ColorRgba.");
            return;
        }

        this._components[0] = obj._components[0];
        this._components[1] = obj._components[1];
        this._components[2] = obj._components[2];
        this._components[3] = obj._components[3];
    }

    setRGBA(r, g, b, a = 255) {

        if (
            this._isValidRGBValue(r) === false ||
            this._isValidRGBValue(g) === false || 
            this._isValidRGBValue(g) === false || 
            this._isValidRGBValue(a) === false
        ) {
            console.error(`setRGBA invalid values: ${[r, g, b, a]}`);
            return;
        }

        this._components[0] = r;
        this._components[1] = g;
        this._components[2] = b;
        this._components[3] = a;
        return this;

    }

    setHEX(hex) {

        const valid = /(^#{0,1}[0-9A-F]{6}$)|(^#{0,1}[0-9A-F]{3}$)/i.test(hex);
        if (valid === false) {
            console.error(`Invalid hex color: ${hex}`);
            return;
        }

        if (hex[0] === '#') {
            hex = hex.slice(1);
        }

        if (hex.length === 3) {
            hex = hex.replace(/([0-9A-F])([0-9A-F])([0-9A-F])/i, '$1$1$2$2$3$3');
        }

       this._components[0] = parseInt(hex.substr(0, 2), 16);
       this._components[1] = parseInt(hex.substr(2, 2), 16);
       this._components[2] = parseInt(hex.substr(4, 2), 16);
       this._components[3] = 255;

        return this;
    }


    _isValidRGBValue(val) {
        return (
            typeof (val) === 'number' &&
            isNaN(val) === false &&
            val >= 0 &&
            val <= 255
        );
    }

    setFromHSV(h, s, v) {

        const sat = s / 100;
        const val = v / 100;
        let C = sat * val;
        const H = h / 60;
        let X = C * (1 - Math.abs(H % 2 - 1));
        let m = val - C;
        const precision = 255;

        C = Math.ceil((C + m) * precision) | 0;
        X = Math.ceil((X + m) * precision) | 0;
        m = Math.ceil(m * precision) | 0;

        if (H >= 0 && H < 1) {
            this.setRGBA(C, X, m);
            return;
        }

        if (H >= 1 && H < 2) {
            this.setRGBA(X, C, m);
            return;
        }

        if (H >= 2 && H < 3) {
            this.setRGBA(m, C, X);
            return;
        }

        if (H >= 3 && H < 4) {
            this.setRGBA(m, X, C);
            return;
        }

        if (H >= 4 && H < 5) {
            this.setRGBA(X, m, C);
            return;
        }

        if (H >= 5 && H < 6) {
            this.setRGBA(C, m, X);
            return;
        }
    }


    setFromHSL(h, s, l) {

        const sat = s / 100;
        const lig = l / 100;

        let C = sat * (1 - Math.abs(2 * lig - 1));
        const H = h / 60;
        let X = C * (1 - Math.abs(H % 2 - 1));
        let m = lig - C / 2;
        const precision = 255;

        C = (C + m) * precision | 0;
        X = (X + m) * precision | 0;
        m = m * precision | 0;

        if (H >= 0 && H < 1) { this.setRGBA(C, X, m); return; }
        if (H >= 1 && H < 2) { this.setRGBA(X, C, m); return; }
        if (H >= 2 && H < 3) { this.setRGBA(m, C, X); return; }
        if (H >= 3 && H < 4) { this.setRGBA(m, X, C); return; }
        if (H >= 4 && H < 5) { this.setRGBA(X, m, C); return; }
        if (H >= 5 && H < 6) { this.setRGBA(C, m, X); return; }
    }

    toString() {
        return this.rgbaStr;
    }
}

ColorRgba.Red = new ColorRgba(255, 0, 0);
ColorRgba.Green = new ColorRgba(0, 255, 0);
ColorRgba.Blue = new ColorRgba(0, 0, 255);
ColorRgba.Black = new ColorRgba(0, 0, 0);
ColorRgba.White = new ColorRgba(255, 255, 255);
ColorRgba.Transparent = new ColorRgba(0, 0, 0, 0);
ColorRgba.Fuschia = new ColorRgba(255, 0, 255);
ColorRgba.Yellow = new ColorRgba(255, 255, 0);
ColorRgba.Cyan = new ColorRgba(0, 255, 255);

