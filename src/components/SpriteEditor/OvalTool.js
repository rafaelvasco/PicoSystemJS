import Tool from "./Tool";
import { ToolNames } from "../../model/Constants";
import { snapPoint } from "../../model/Calculate";
import Rect from "../../model/Rect";
import Point from "../../model/Point";
import ColorRgba from "../../model/ColorRgba";

export default class OvalTool extends Tool {
    constructor() {
        super();
        this._rect = new Rect();
        this._pivotPos = new Point();
        this._curMousePos = new Point();
        this._lastMousePos = new Point();
        this._transparentOverlayColor = new ColorRgba(255, 0, 255);
        this._mouseDown = false;
        this._perfectCircle = false;
        this._filled = false;
        this._curColor = null;
    }

    get name() {
        return ToolNames.Oval;
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
            this._updateRect(pixelSize);
            this._paintOverlay(editor);
            this._lastMousePos.x = this._curMousePos.x;
            this._lastMousePos.y = this._curMousePos.y;
            return true;
        }

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

    onKeyDown(editor, key) {
        if (key === "Shift") {
            this._perfectCircle = true;
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
            this._perfectCircle = false;
            if (this._mouseDown === true) {
                this._updateRect(editor.pixelsize);
                this._paintOverlay(editor);
                return true;
            }
        }
        return false;
    }

    _paintOverlay(editor) {
        const overlay = editor.overlay;
        // const pixelSize = editor.pixelsize;
        // const mirrorX = editor.mirrorX;
        // const mirrorY = editor.mirrorY;
        const color =
            this._curColor.alpha > 0
                ? this._curColor
                : this._transparentOverlayColor;
        overlay.erase();

        overlay.drawCircle(
            this._rect.left,
            this._rect.top,
            this._rect.right,
            this._rect.bottom,
            color
        );
    }

    _paintPixmap(editor) {
        const pixmap = editor.pixmap;
        // const pixelSize = editor.pixelsize;
        // const mirrorX = editor.mirrorX;
        // const mirrorY = editor.mirrorY;
        const color =
            this._curColor.alpha > 0
                ? this._curColor
                : this._transparentOverlayColor;
        pixmap.drawCircle(
            this._rect.left,
            this._rect.top,
            this._rect.right,
            this._rect.bottom,
            color
        );
    }

    _updateRect(pixelSize) {
        this._rect.x = Math.min(this._curMousePos.x, this._pivotPos.x);
        this._rect.y = Math.min(this._curMousePos.y, this._pivotPos.y);
        this._rect.width = Math.abs(this._curMousePos.x - this._pivotPos.x);
        this._rect.height = Math.abs(this._curMousePos.y - this._pivotPos.y);

        if (this._perfectCircle === true) {
            this._rect.width = this._rect.height;
        }

        if (this._filled === false) {
            this._rect.width -= pixelSize;
            this._rect.height -= pixelSize;
        }
    }
}
