import Tool from "./Tool";
import { ToolNames } from "../../model/Constants";
import { snapPoint } from "../../model/Calculate";
import Rect from "../../model/Rect";
import Point from "../../model/Point";
import ColorRgba from "../../model/ColorRgba";

export default class RectTool extends Tool {
    constructor() {
        super();
        this._mouseDown = false;
        this._rect = new Rect();
        this._pivotPos = new Point();
        this._curMousePos = new Point();
        this._lastMousePos = new Point();
        this._transparentOverlayColor = new ColorRgba(255, 0, 255);
        this._curColor = null;
        this._filled = false;
    }

    get name() {
        return ToolNames.Rect;
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

        return false;
    }

    onMouseUp(editor, _) {
        this._mouseDown = false;
        if (this._rect.isEmpty === false) {
            editor.overlay.erase();
            this._paintPixmap(editor);
            this._rect.zero();
        }
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
            this._updateRect(pixelSize);
            this._paintOverlay(editor);
            this._lastMousePos.x = this._curMousePos.x;
            this._lastMousePos.y = this._curMousePos.y;
            return true;
        }

        return false;
    }

    onKeyDown(editor, key) {
        if (key === "Shift") {
            this._filled = true;
            if (this._mouseDown === true) {
                this._updateRect(editor.pixelsize);
                this._paintOverlay(editor);
                return true;
            }
        }
        return false;
    }

    onKeyUp(editor, key) {
        if (key === "Shift") {
            this._filled = false;
            if (this._mouseDown === true) {
                this._updateRect(editor.pixelsize);
                this._paintOverlay(editor);
                return true;
            }
        }

        return false;
    }

    _paintPixmap(editor) {
        const pixmap = editor.pixmap;
        const pixelSize = editor.pixelsize;
        const mirrorX = editor.mirrorX;
        const mirrorY = editor.mirrorY;

        if (this._filled === false) {
            pixmap.drawRect(
                this._rect.left,
                this._rect.top,
                this._rect.right,
                this._rect.bottom,
                this._curColor,
                pixelSize
            );

            if (mirrorX || mirrorY) {
                const mirrorLeftDelta = mirrorX
                    ? (this._rect.left - pixmap.width / 2) * 2
                    : 0;
                const mirrorRightDelta = mirrorX
                    ? (this._rect.right - pixmap.width / 2) * 2
                    : 0;
                const mirrorTopDelta = mirrorY
                    ? (this._rect.top - pixmap.height / 2) * 2
                    : 0;
                const mirrorBottomDelta = mirrorY
                    ? (this._rect.bottom - pixmap.height / 2) * 2
                    : 0;
                pixmap.drawRect(
                    this._rect.left - mirrorLeftDelta,
                    this._rect.top - mirrorTopDelta,
                    this._rect.right - mirrorRightDelta,
                    this._rect.bottom - mirrorBottomDelta,
                    this._curColor,
                    pixelSize
                );
            }
        } else {
            pixmap.fillRect(
                this._rect.left,
                this._rect.top,
                this._rect.right,
                this._rect.bottom,
                this._curColor,
                pixelSize
            );

            if (mirrorX || mirrorY) {
                const mirrorLeftDelta = mirrorX
                    ? (this._rect.left - pixmap.width / 2) * 2
                    : 0;
                const mirrorRightDelta = mirrorX
                    ? (this._rect.right - pixmap.width / 2) * 2
                    : 0;
                const mirrorTopDelta = mirrorY
                    ? (this._rect.top - pixmap.height / 2) * 2
                    : 0;
                const mirrorBottomDelta = mirrorY
                    ? (this._rect.bottom - pixmap.height / 2) * 2
                    : 0;
                pixmap.fillRect(
                    this._rect.left - mirrorLeftDelta,
                    this._rect.top - mirrorTopDelta,
                    this._rect.right - mirrorRightDelta,
                    this._rect.bottom - mirrorBottomDelta,
                    this._curColor,
                    pixelSize
                );
            }
        }
    }

    _paintOverlay(editor) {
        const overlay = editor.overlay;
        const pixelSize = editor.pixelsize;
        const mirrorX = editor.mirrorX;
        const mirrorY = editor.mirrorY;
        const color = this._curColor.alpha > 0 ? this._curColor : this._transparentOverlayColor;

        overlay.erase();
        if (this._filled === false) {
            overlay.drawRect(
                this._rect.left,
                this._rect.top,
                this._rect.right,
                this._rect.bottom,
                color,
                pixelSize
            );

            if (mirrorX || mirrorY) {
                const mirrorLeftDelta = mirrorX
                    ? (this._rect.left - overlay.width / 2) * 2
                    : 0;
                const mirrorRightDelta = mirrorX
                    ? (this._rect.right - overlay.width / 2) * 2
                    : 0;
                const mirrorTopDelta = mirrorY
                    ? (this._rect.top - overlay.height / 2) * 2
                    : 0;
                const mirrorBottomDelta = mirrorY
                    ? (this._rect.bottom - overlay.height / 2) * 2
                    : 0;
                overlay.drawRect(
                    this._rect.left - mirrorLeftDelta,
                    this._rect.top - mirrorTopDelta,
                    this._rect.right - mirrorRightDelta,
                    this._rect.bottom - mirrorBottomDelta,
                    color,
                    pixelSize
                );
            }
        } else {
            overlay.fillRectNative(
                this._rect.left,
                this._rect.top,
                this._rect.right,
                this._rect.bottom,
                color,
                pixelSize
            );

            if (mirrorX || mirrorY) {
                const mirrorLeftDelta = mirrorX
                    ? (this._rect.left - overlay.width / 2) * 2
                    : 0;
                const mirrorRightDelta = mirrorX
                    ? (this._rect.right - overlay.width / 2) * 2
                    : 0;
                const mirrorTopDelta = mirrorY
                    ? (this._rect.top - overlay.height / 2) * 2
                    : 0;
                const mirrorBottomDelta = mirrorY
                    ? (this._rect.bottom - overlay.height / 2) * 2
                    : 0;
                overlay.fillRectNative(
                    this._rect.left - mirrorLeftDelta,
                    this._rect.top - mirrorTopDelta,
                    this._rect.right - mirrorRightDelta,
                    this._rect.bottom - mirrorBottomDelta,
                    color,
                    pixelSize
                );
            }
        }
    }

    _updateRect(pixelSize) {
        this._rect.x = Math.min(this._curMousePos.x, this._pivotPos.x);
        this._rect.y = Math.min(this._curMousePos.y, this._pivotPos.y);
        this._rect.width = Math.abs(this._curMousePos.x - this._pivotPos.x);
        this._rect.height = Math.abs(this._curMousePos.y - this._pivotPos.y);

        if (this._filled === false) {
            this._rect.width -= pixelSize;
            this._rect.height -= pixelSize;
        }
    }
}
