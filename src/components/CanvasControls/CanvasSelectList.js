import CanvasDropDown from "./CanvasDropdown";
import CanvasControl from "./CanvasControl";
import { clampInArray, clamp } from "../../model/Calculate";

export default class CanvasSelectList extends CanvasControl {
    static ItemHeight = 30;

    static ChangeEvent = 0;

    constructor(params) {
        super(params);
        this._items = [];
        this._currentIndex = -1;
        this._hoveredIndex = -1;
        this._lastHoveredIndex = -1;
        this._translationY = 0;
        this._grabY = 0;
        this._panning = false;
        this._maxItemsInView =
            ((this.bounds.height / CanvasSelectList.ItemHeight) | 0) + 1;
        this._maxTranslationY = 0;
    }

    get currentIndex() {
        return this._currentIndex;
    }

    get length() {
        return this._items.length;
    }

    addItem(label, value) {
        this._items.push({
            label: label,
            value: value
        });

        if (this._items.length > this._maxItemsInView) {
            this._translationY =
                -(this._items.length - this._maxItemsInView) *
                CanvasSelectList.ItemHeight;
        } else {
            this._translationY = 0;
        }

        if (this._items.length < this._maxItemsInView) {
            this._maxTranslationY = 0;
        }
        else {
            this._maxTranslationY = -(this._items.length -  this._maxItemsInView) * CanvasSelectList.ItemHeight;
        }   

        this.refresh();
    }

    clear() {
        this._items = [];
        this.refresh();
    }

    selectItem(index) {
        this._currentIndex = clampInArray(this._items, index);
        this.refresh();
    }

    onMouseDown(button, x, y) {
        this._panning = true;
        this._grabY = y;
        if (this._items.length > 0) {
            if (this._bounds.containsPoint(x, y) && this._hoveredIndex >= 0) {
                this._currentIndex = this._hoveredIndex;
                this.emit(CanvasSelectList.ChangeEvent, this._currentIndex);
                return true;
            }
        }
        return false;
    }

    onMouseUp(button, x, y) {
        this._panning = false;
    }

    onMouseMove(x, y) {
        if(this._panning === false) {
            const itemHeight = CanvasSelectList.ItemHeight;
            if (this._bounds.containsPoint(x, y)) {
                this._hoveredIndex = ((y - this._bounds.y - this._translationY) / itemHeight) | 0;
                this._hoveredIndex = clampInArray(this._items, this._hoveredIndex);
                return true;
            }
        }
        else {
            const deltaY = y - this._grabY;
            this._translationY += deltaY;
            this._grabY = y;
            this._translationY = clamp(this._translationY, this._maxTranslationY, 0);
            return true;

        }
       
        return false;
    }

    onMouseLeave() {
        this._grabY = 0;
        this._panning = false;
        return true;
    }

    paint(g) {
        g.save();
        const backColor = this.style.backColor;
        const borderColor = this.style.borderColor;
        const textColor = this.style.textColor;
        const itemSelectColor = this.style.itemSelectColor;
        const font = this.style.font;
        const x = this._bounds.x;
        const y = this._bounds.y;
        const w = this._bounds.width;
        const h = this._bounds.height;
        const itemHeight = CanvasDropDown.ItemHeight;
        g.fillStyle = backColor;
        g.strokeStyle = borderColor;
        g.beginPath();
        g.rect(x, y, w, h);
        g.clip();
        g.fill();
        g.stroke();
        g.translate(0, this._translationY);
        if (this._items.length > 0) {
            g.font = font;
            g.fillStyle = textColor;
            for (let i = 0; i < this._items.length; ++i) {
                const item = this._items[i];
                const textMeasure = g.measureText(item.label);
                const labelWidth = textMeasure.width;
                const labelHeight = textMeasure.actualBoundingBoxAscent;
                if (i === this._currentIndex) {
                    g.fillStyle = itemSelectColor;
                    g.fillRect(x, y + i * itemHeight, w, itemHeight);
                }
                g.fillStyle = textColor;
                g.fillText(
                    item.label,
                    x + w / 2 - labelWidth / 2,
                    y + labelHeight / 4 + i * itemHeight + labelHeight * 2
                );
            }
        }
        g.restore();
    }
}
