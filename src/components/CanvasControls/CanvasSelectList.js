import CanvasDropDown from "./CanvasDropdown";
import CanvasControl from "./CanvasControl";
import { clampInArray } from "../../model/Calculate";

export default class CanvasSelectList extends CanvasControl {
    static ItemHeight = 30;

    static ChangeEvent = 0;

    constructor(params) {
        super(params);
        this._items = [];
        this._currentIndex = -1;
        this._hoveredIndex = -1;
        this._lastHoveredIndex = -1;
    }

    addItem(label, value) {
        this._items.push({
            label: label,
            value: value
        });
        this._currentIndex++;
        this.refresh();
    }

    onMouseDown(button, x, y) {
       
        if (this._items.length > 0) {
            if (this._bounds.containsPoint(x, y) && this._hoveredIndex >= 0) {
                this._currentIndex = this._hoveredIndex;
                this.emit(
                    CanvasDropDown.ChangeEvent,
                    this._items[this._currentIndex]
                );
                return true;
            }
        }
        return false;
    }

    onMouseMove(x, y) {
        const itemHeight = CanvasSelectList.ItemHeight;
        if (this._bounds.containsPoint(x, y)) {
            this._hoveredIndex = ((y - this._bounds.y) / itemHeight) | 0;
            this._hoveredIndex = clampInArray(this._items, this._hoveredIndex);
            return true;
        }
        return false;
    }

    paint(g) {
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
        g.save();
        g.fillStyle = backColor;
        g.fillRect(x, y, w, h);
        g.strokeStyle = borderColor;
        g.strokeRect(x, y, w, h);

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
