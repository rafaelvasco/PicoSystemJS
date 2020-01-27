export default class Rect {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x | 0;
        this.y = y | 0;
        this.width = width;
        this.height = height;
    }

    get left() {
        return Math.min(this.x, this.x + this.width);
    }

    get top() {
        return Math.min(this.y, this.y + this.height);
    }

    get right() {
        return Math.max(this.x, this.x + this.width);
    }

    get bottom() {
        return Math.max(this.y, this.y + this.height);
    }

    get isEmpty() {
        return this.width === 0 && this.height === 0;
    }

    normalize() {
        this.width = Math.abs(this.width);
        this.height = Math.abs(this.height);
    }

    zero() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }

    containsPoint(x, y) {
        if (x < this.left) {
            return false;
        }

        if (x > this.right) {
            return false;
        }

        if (y < this.top) {
            return false;
        }

        if (y > this.bottom) {
            return false;
        }

        return true;
    }

    containsPont(point) {
        return this.containsPoint(point.x, point.y);
    }
}
