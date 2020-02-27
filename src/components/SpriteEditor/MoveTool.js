import Tool from "./Tool";
import { ToolNames } from "../../model/Constants";
import { snap, snapPoint } from "../../model/Calculate";

export default class MoveTool extends Tool {
    constructor() {
        super();
        this._lastPosX = 0;
        this._lastPosY = 0;
        this._moving = false;
    }

    get name() {
        return ToolNames.Move;
    }

    onMouseDown(editor, event) {
        if (event.button === 0) {
            const pos = event.pos;
            const pixelSize = editor.pixelsize;
            this._lastPosX = snap(pos.x, pixelSize);
            this._lastPosY = snap(pos.y, pixelSize);
            this._moving = true;
        }

        return false;
    }

    onMouseUp(editor, event) {
        const button = event.button;

        if (button === 0) {
            this._moving = false;
        }

        return true;
    }

    onMouseMove(editor, event) {
        if (this._moving === false) {
            return false;
        }

        const pos = event.pos;
        const pixelSize = editor.pixelsize;
        snapPoint(pos, pixelSize);
        const pixmap = editor.pixmap;

        if (this._moving) {
            const dx = (pos.x - this._lastPosX) | 0;
            const dy = (pos.y - this._lastPosY) | 0;

            if (dx !== 0 || dy !== 0) {
                pixmap.movePixels(dx, dy);

                this._lastPosX = pos.x;
                this._lastPosY = pos.y;

                return true;
            }
        }
        return false;
    }

    onKeyDown(_, key) {
    }

    onKeyUp(editor, key) {
    }
}
