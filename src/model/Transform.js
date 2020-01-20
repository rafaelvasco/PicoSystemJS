import Point from "./Point";

export default class Transform {
    constructor() {
        this._m = [0, 0, 0, 0, 0, 0];
        this.reset();
    }

    reset() {
        this._m[0] = 1;
        this._m[1] = 0;
        this._m[2] = 0;
        this._m[3] = 1;
        this._m[4] = 0;
        this._m[5] = 0;
    }

    multiply(other) {
        let m = this._m;
        let o = other._m;

        let m11 = m[0] * o[0] + m[2] * o[1];
        let m12 = m[1] * o[0] + m[3] * o[1];
        let m21 = m[0] * o[2] + m[2] * o[3];
        let m22 = m[1] * o[2] + m[3] * o[3];

        let dx = m[0] * o[4] + m[2] * o[5] + m[4];
        let dy = m[1] * o[4] + m[3] * o[5] + m[5];

        m[0] = m11;
        m[1] = m12;
        m[2] = m21;
        m[3] = m22;
        m[4] = dx;
        m[5] = dy;
    }

    roundTranslateToNearestInteger() {
        this._m[4] |= 0;
        this._m[5] |= 0;
    }

    inverse() {
        let inv = new Transform();

        let invm = (inv._m = this._m.slice(0));

        let d = 1.0 / (invm[0] * invm[3] - invm[1] * invm[2]);
        let m0 = invm[3] * d;
        let m1 = -invm[1] * d;
        let m2 = -invm[2] * d;
        let m3 = invm[0] * d;
        let m4 = d * (invm[2] * invm[5] - invm[3] * invm[4]);
        let m5 = d * (invm[1] * invm[4] - invm[0] * invm[5]);

        invm[0] = m0;
        invm[1] = m1;
        invm[2] = m2;
        invm[3] = m3;
        invm[4] = m4;
        invm[5] = m5;

        return inv;
    }

    translate(x, y) {
        let m = this._m;

        m[4] += m[0] * x + m[2] * y;
        m[5] += m[1] * x + m[3] * y;
    }

    scale(scale) {
        let m = this._m;

        m[0] *= scale;
        m[3] *= scale;
    }

    transformPoint(point) {
        let x = point.x;
        let y = point.y;

        let m = this._m;

        point.x = x * m[0] + y * m[2] + m[4];
        point.y = x * m[1] + y * m[3] + m[5];
    }

    transformRect(rect) {
        let topLeft = new Point(rect.left, rect.top);
        let bottomRight = new Point(rect.right, rect.bottom);

        this.transformPoint(topLeft);
        this.transformPoint(bottomRight);

        rect.x = topLeft.x;
        rect.y = topLeft.y;
        rect.width = bottomRight.x - topLeft.x;
        rect.height = bottomRight.y - topLeft.y;
    }

    toString() {
        return `[${this._m[0]},${this._m[1]},${this._m[2]},${this._m[3]},${this._m[4]},${this._m[5]}]`;
    }
}
