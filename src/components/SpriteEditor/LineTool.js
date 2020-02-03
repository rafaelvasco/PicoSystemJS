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
        this._lastMousePos = new Point();
        this._mouseDown = false;
        this._curColor = null;
        this._transparentOverlayColor = new ColorRgba(255, 0, 255);
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
        this._lastMousePos.x = pos.x;
        this._lastMousePos.y = pos.y;
        this._pivotPos.x = pos.x;
        this._pivotPos.y = pos.y;
        this._curColor =
            button === 0
                ? editor.primaryColor
                : button === 2
                ? editor.secondaryColor
                : editor.primaryColor;

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
        if (
            this._curMousePos.x !== this._lastMousePos.x ||
            this._curMousePos.y !== this._lastMousePos.y
        ) {
            this._updateLine();
            this._paintOverlay(editor);
            this._lastMousePos.x = this._curMousePos.x;
            this._lastMousePos.y = this._curMousePos.y;
            return true;
        }

        return false;
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
        const x1 = this._x1;
        const y1 = this._y1;
        const x2 = this._x2;
        const y2 = this._y2;
        const size = editor.pixelsize;
        const halfPw = editor.overlay.width / 2;
        const halfPh = editor.overlay.height / 2;
        const mirrorX = editor.mirrorX;
        const mirrorY = editor.mirrorY;
        const overlay = editor.overlay;
        const color = this._curColor.alpha > 0 ? this._curColor : this._transparentOverlayColor;

        overlay.erase();
        overlay.drawLine(x1, y1, x2, y2, size, color);

        if (mirrorX || mirrorY) {
            const mirrorX1Delta = mirrorX ? (x1 - halfPw) * 2 : 0;
            const mirrorY1Delta = mirrorY ? (y1 - halfPh) * 2 : 0;
            const mirrorX2Delta = mirrorX ? (x2 - halfPw) * 2 : 0;
            const mirrorY2Delta = mirrorY ? (y2 - halfPh) * 2 : 0;
            overlay.drawLine(
                x1 - mirrorX1Delta,
                y1 - mirrorY1Delta,
                x2 - mirrorX2Delta,
                y2 - mirrorY2Delta,
                size,
                color
            );
        }
    }

    _updateLine() {
        this._x1 = this._pivotPos.x;
        this._y1 = this._pivotPos.y;
        this._x2 = this._curMousePos.x;
        this._y2 = this._curMousePos.y;
    }

    _paintPixmap(editor) {
        const x1 = this._x1;
        const y1 = this._y1;
        const x2 = this._x2;
        const y2 = this._y2;
        const col = this._curColor;
        const size = editor.pixelsize;
        const halfPw = editor.pixmap.width / 2;
        const halfPh = editor.pixmap.height / 2;
        const mirrorX = editor.mirrorX;
        const mirrorY = editor.mirrorY;
        const pixmap = editor.pixmap;

        pixmap.drawLine(x1, y1, x2, y2, size, col);

        if (mirrorX || mirrorY) {
            const mirrorX1Delta = mirrorX ? (x1 - halfPw) * 2 : 0;
            const mirrorY1Delta = mirrorY ? (y1 - halfPh) * 2 : 0;
            const mirrorX2Delta = mirrorX ? (x2 - halfPw) * 2 : 0;
            const mirrorY2Delta = mirrorY ? (y2 - halfPh) * 2 : 0;
            pixmap.drawLine(
                x1 - mirrorX1Delta,
                y1 - mirrorY1Delta,
                x2 - mirrorX2Delta,
                y2 - mirrorY2Delta,
                size,
                col
            );
        }
    }
}
