import Tool from "./Tool";
import { ToolNames } from "../../model/Constants";

export default class FillTool extends Tool {
    constructor() {
        super();
        this._fillFree = false;
    }

    get contiguous() {
        return this._contiguous;
    }

    set contiguous(val) {
        this._contiguous = val;
    }

    get name() {
        return ToolNames.Fill;
    }

    onKeyDown(_, key) {
        if (key === "Shift") {
            this._fillFree = true;
        }
        return false;
    }

    onKeyUp(_, key) {
        if (key === "Shift") {
            this._fillFree = false;
        }
    }

    onMouseDown(editor, event) {
        const button = event.button;
        const pos = event.pos;
        const pixmap = editor.pixmap;

        const color =
            button === 0
                ? editor.primaryColor
                : button === 2
                ? editor.secondaryColor
                : editor.primaryColor;

        if (this._fillFree === false) {
            pixmap.fill(pos.x, pos.y, color);

            if (editor.mirrorX || editor.mirrorY) {
                const mirrorXDelta = editor.mirrorX
                    ? (pos.x - editor.pixmap.width / 2) * 2
                    : 0;
                const mirrorYDelta = editor.mirrorY
                    ? (pos.y - editor.pixmap.height / 2) * 2
                    : 0;
                pixmap.fill(pos.x - mirrorXDelta, pos.y - mirrorYDelta, color);
            }
        } else {
            pixmap.fillAll(pos.x, pos.y, color);

            if (editor.mirrorX || editor.mirrorY) {
                const mirrorXDelta = editor.mirrorX
                    ? (pos.x - editor.pixmap.width / 2) * 2
                    : 0;
                const mirrorYDelta = editor.mirrorY
                    ? (pos.y - editor.pixmap.height / 2) * 2
                    : 0;
                pixmap.fillAll(pos.x - mirrorXDelta, pos.y - mirrorYDelta, color);
            }
        }

        return true;
    }

    onMouseUp(editor, event) {
        return true;
    }
}
