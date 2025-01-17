import Tool from "./Tool";
import Point from "../../model/Point";
import { ToolNames } from "../../model/Constants";

export default class PenTool extends Tool {
    constructor() {
        super();
        this._curPoint = new Point();
        this._lastPoint = new Point();
        this._painting = false;
        this._cleanLine = false;
    }

    get name() {
        return ToolNames.Pen;
    }

    onMouseDown(editor, event) {
        const button = event.button;
        const pos = event.pos;
        const pixmap = editor.pixmap;
        const size = editor.pixelsize;

        let x = 0;
        let y = 0;

        if (size > 1) {
            x = this._curPoint.x = (Math.floor(pos.x / size) * size) | 0;
            y = this._curPoint.y = (Math.floor(pos.y / size) * size) | 0;
        } else {
            x = this._curPoint.x = pos.x;
            y = this._curPoint.y = pos.y;
        }

        this._painting = true;

        const color =
            button === 0
                ? editor.primaryColor
                : button === 2
                ? editor.secondaryColor
                : editor.primaryColor;

        pixmap.drawPoint(x, y, size, color);

        if (editor.mirrorX || editor.mirrorY) {
            const mirrorXDelta = editor.mirrorX
                ? (x - editor.pixmap.width / 2) * 2
                : 0;
            const mirrorYDelta = editor.mirrorY
                ? (y - editor.pixmap.height / 2) * 2
                : 0;
            pixmap.drawPoint(x - mirrorXDelta, y - mirrorYDelta, size, color);
        }

        return true;
    }

    onMouseUp(editor, event) {
        this._painting = false;
        return true;
    }

    onMouseMove(editor, event) {
        if (!this._painting) {
            return false;
        }

        const button = event.button;
        const pos = event.pos;
        const pixmap = editor.pixmap;
        const size = editor.pixelsize;
        const mirrorX = editor.mirrorX;
        const mirrorY = editor.mirrorY;
        const halfPw = pixmap.width / 2;
        const halfPh = pixmap.height / 2;

        let x = 0;
        let y = 0;

        this._lastPoint.x = this._curPoint.x;
        this._lastPoint.y = this._curPoint.y;

        const color =
            button === 0
                ? editor.primaryColor
                : button === 2
                ? editor.secondaryColor
                : editor.primaryColor;

        if (size > 1) {
            x = this._curPoint.x = (Math.floor(pos.x / size) * size) | 0;
            y = this._curPoint.y = (Math.floor(pos.y / size) * size) | 0;
        } else {
            x = this._curPoint.x = pos.x;
            y = this._curPoint.y = pos.y;
        }

        let dx = Math.abs(x - this._lastPoint.x);
        let dy = Math.abs(y - this._lastPoint.y);

        if (
            (dx === size && dy === 0) ||
            (dx === 0 && dy === size) ||
            (dx === size && dy === size)
        ) {
            pixmap.drawPoint(x, y, size, color);

            if (mirrorX || mirrorY) {
                const mirrorXDelta = mirrorX
                    ? (x - pixmap.width / 2) * 2
                    : 0;
                const mirrorYDelta = mirrorY
                    ? (y - editor.pixmap.height / 2) * 2
                    : 0;

                pixmap.drawPoint(
                    x - mirrorXDelta,
                    y - mirrorYDelta,
                    size,
                    color
                );
            }

            return true;
        } else if (dx >= size || dy >= size) {
            pixmap.drawLine(
                this._lastPoint.x,
                this._lastPoint.y,
                x,
                y,
                size,
                color
            );

            if (mirrorX || mirrorY) {

                const mirrorX1Delta = mirrorX ? (this._lastPoint.x - halfPw) * 2 : 0;
                const mirrorY1Delta = mirrorY ? (this._lastPoint.y - halfPh) * 2 : 0;
                const mirrorX2Delta = mirrorX ? (x - halfPw) * 2 : 0;
                const mirrorY2Delta = mirrorY ? (y - halfPh) * 2 : 0;

                pixmap.drawLine(
                    this._lastPoint.x - mirrorX1Delta,
                    this._lastPoint.y - mirrorY1Delta,
                    x - mirrorX2Delta,
                    y - mirrorY2Delta,
                    size,
                    color
                );
            }

            return true;
        }

        return false;
    }
}
