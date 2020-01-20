export default class ColorHsv {

    constructor(){

        this._hue = 0;
        this._sat = 0;
        this._val = 0;
    }



    get hsvStr() {
        return `hsv(${this._hue}, ${this._sat}, ${this._val})`;
    }

    get hue () {
        return this._hue
    }
    
    set hue (val) {

        if (this._isValidHSVValue(val)) {
            console.error(`Invalid hue value: ${val}`);
        }

        if (val > 359) {
            val = 0
        }

        this._hue = val
    }

    get saturation() {
        return this._sat;
    }

    set saturation() {
        
        if (this._isValidHSVValue(val)) {
            console.error(`Invalid saturation value: ${val}`);
        }

        this._sat = val;
    }

    get value() {
        return this._val;
    }

    set value(val) {

        if (this._isValidHSVValue(val)) {
            console.error(`Invalid value value: ${val}`);
        }

        this._val = val;

    }

    copy(obj) {
        
        if (obj instanceof ColorHsv === false) {
            console.error("Can't copy object other than ColorHsv.");
            return;
        }

        this._hue = obj._hue;
        this._sat = obj._sat;
        this._val = obj._val;

    }

    setHSV(h, s, v) {

        this._hue = h;
        this._sat = s;
        this._val = v;
        return this;
    }

    setHSL(h, s, l) {

        if (
            this._isValidHSLValue(h) === false ||
            this._isValidHSLValue(s) === false ||
            this._isValidHSLValue(l) === false            
        ) {
            console.error(`Invalid HSL Values: ${[h, s, l]}`);
        }

        this._hue = h;
        this._sat = l;
        this._light = l;
        this._needsUpdateRgb = true;
    }

    _isValidHSVValue(val) {
        return (
                typeof val === 'number' &&
                isNaN(val) === false && 
                val >= 0 &&
                val <= 100
        );

    }

    setFromRGB(r, g, b) {
        
        const red = r / 255;
        const green = g / 255;
        const blue = b / 255;

        const cmax = Math.max(red, green, blue);
        const cmin = Math.min(red, green, blue);
        const delta = cmax - cmin;

        let hue = 0;
        let saturation = 0;

        if (delta) {

            if (cmax === red) { hue = ((green - blue) / delta); }
            if (cmax === green) { hue = 2 + (blue - red) / delta; }
            if (cmax === blue) { hue = 4 + (red - green) / delta; }
            if (cmax) { saturation = delta / cmax; }

        }

        this._hue = Math.ceil(60 * hue) | 0;

        if (this._hue < 0) { this._hue += 360; }

        this._saturation = Math.ceil(saturation * 100) | 0;
        this._value = Math.ceil(cmax * 100) | 0;

    }

}

