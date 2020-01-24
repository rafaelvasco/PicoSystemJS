import Tool from "./Tool";
import { ToolNames } from "../../model/Constants";
import Point from "../../model/Point";
import ColorRgba from "../../model/ColorRgba";
import { snapPoint } from "../../model/Calculate";

export default class LineTool extends Tool {
    constructor() {
        super();
        this._x1 = 0;
        this._y1 = 0;
        this._x2 = 0;
        this._y2 = 0;
        this._pivotPos = new Point();
        this._curMousePos = new Point();
        this._mouseDown = false;
        this._curColor = null;
        this._overlayColor = new ColorRgba(255, 0, 255, 120);
    }

    get name() {
        return ToolNames.Line;
    }

    onMouseDown(editor, event) {
        const button = event.button;
        const pos = event.pos;
        const pixelSize = editor.pixelsize;
        snapPoint(pos, pixelSize);
        this._mouseDown = true;
        this._curMousePos.x = pos.x;
        this._curMousePos.y = pos.y;
        this._pivotPos.x = pos.x;
        this._pivotPos.y = pos.y;
        this._curColor =
            button === 0
                ? editor.primaryColor
                : button === 2
                ? editor.secondaryColor
                : editor.primaryColor;

        editor.pixmap.drawPoint(pos.x, pos.y, pixelSize, this._curColor);
        return true;
    }

    onMouseMove(editor, event) {
        if (this._mouseDown === false) {
            return false;
        }
        const pixelSize = editor.pixelsize;
        snapPoint(event.pos, pixelSize);
        this._curMousePos.x = event.pos.x;
        this._curMousePos.y = event.pos.y;
        this._updateLine();
        this._paintOverlay(editor);
        return true;
    }

    onMouseUp(editor, event) {
        this._mouseDown = false;
        editor.overlay.erase();
        this._updateLine();
        this._paintPixmap(editor);
        this._x1 = 0;
        this._x2 = 0;
        this._y1 = 0;
        this._y2 = 0;
        return true;
    }

    _paintOverlay(editor) {
        editor.overlay.erase();
        editor.overlay.drawLine(
            this._x1,
            this._y1,
            this._x2,
            this._y2,
            editor.pixelsize,
            this._overlayColor
        );
    }

    _updateLine() {
        this._x1 = Math.min(this._curMousePos.x, this._pivotPos.x);
        this._y1 = Math.min(this._curMousePos.y, this._pivotPos.y);
        this._x2 = Math.max(this._curMousePos.x, this._pivotPos.x);
        this._y2 = Math.max(this._curMousePos.y, this._pivotPos.y);
    }

    _paintPixmap(editor) {
        
        editor.pixmap.drawLine(
            this._x1,
            this._y1,
            this._x2,
            this._y2,
            editor.pixelsize,
            this._curColor
        );
    }
}
