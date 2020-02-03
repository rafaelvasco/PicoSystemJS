import CanvasElement from "../CanvasElement";
import Pixmap from "../../model/Pixmap";
import PixmapUtils from "../../model/PixmapUtils";
import Point from "../../model/Point";
import Rect from "../../model/Rect";
import Transform from "../../model/Transform";
import ColorRgba from "../../model/ColorRgba";
import Brush from "../../model/Brush";
import PenTool from "./PenTool";
import FillTool from "./FillTool";
import MoveTool from "./MoveTool";
import RectTool from "./RectTool";
import LineTool from "./LineTool";

class MouseEvent {
    constructor() {
        this.buton = null;
        this.pos = new Point();
        this.absPos = new Point();
    }
}

export default class SpriteEditor extends CanvasElement {

    static PickerAttribs = {
        OffsetX: 0,
        OffsetY: -32,
        Width: 32,
        Height: 32
    }

    static Actions = {
        ResetView: 0
    }

    constructor(width, height) {
        super("sprite-editor", width, height);
        this._pixelSize = 4;
        this._pixmap = Pixmap.create(width, height);
        this._overlay = Pixmap.create(width, height);
        this._untransformedOverlay = Pixmap.create(width, height);
        this._bgRect = new Rect(0, 0, width, height);
        this._savedTransforms = [];
        this._mousePos = new Point();
        this._untransormedMousePos = new Point();
        this._viewTransform = new Transform();
        this._viewCenterTransform = new Transform();
        this._combinedTransform = new Transform();
        this._invertedCombinedTransform = new Transform();
        this._primaryColor = ColorRgba.Red;
        this._secondaryColor = ColorRgba.Transparent;
        this._tools = [];
        this._toolsMap = {};
        this._toolIndex = 0;
        this._mouseEvent = new MouseEvent();
        this._panning = false;
        this._lastPanPos = new Point();
        this._animationTimer = null;
        this._checkerBrush = null;
        this._mirrorX = false;
        this._mirrorY = false;
        this._ctrlDown = false;
        this._mouseDown = false;
        this._sampledColor = null;

        this._initializeBackground();
        this._initializeTools();
        this._recalculateViewCenter();
        this._updateTransformMatrices();
        this.paint();
    }

    unload() {
        this._pixmap = null;
        this._overlay = null;
        this._untransformedOverlay = null;
        this._savedTransforms = [];
    }

    get pixelsize() {
        return this._pixelSize;
    }

    get mirrorX() {
        return this._mirrorX;
    }

    set mirrorX(val) {
        this._mirrorX = val;
    }

    get mirrorY() {
        return this._mirrorY;
    }

    set mirrorY(val) {
        this._mirrorY = val;
    }

    set pixelsize(val) {
        this._pixelSize = val;
        if (this._pixelSize < 1) {
            this._pixelSize = 1;
        }
    }

    get pixmap() {
        return this._pixmap;
    }

    get overlay() {
        return this._overlay;
    }

    get untranformedOverlay() {
        return this._untransformedOverlay;
    }

    get currentTool() {
        return this._tools[this._toolIndex];
    }

    get primaryColor() {
        return this._primaryColor;
    }
    get secondaryColor() {
        return this._secondaryColor;
    }

    set primaryColor(val) {
        if (typeof val === "object") {
            this._primaryColor.copy(val);
        } else if (typeof val === "string") {
            this._primaryColor.setHEX(val);
        }
    }

    set secondaryColor(val) {
        if (typeof val === "object") {
            this._secondaryColor.copy(val);
        } else if (typeof val === "string") {
            this._secondaryColor.setHEX(val);
        }
    }

    _initializeTools() {
        const pen = new PenTool();
        const fill = new FillTool();
        const move = new MoveTool();
        const rect = new RectTool();
        const line = new LineTool();
        this._registerTool(pen);
        this._registerTool(fill);
        this._registerTool(move);
        this._registerTool(rect);
        this._registerTool(line);
    }

    _registerTool(tool) {
        this._tools.push(tool);
        this._toolsMap[tool.name] = this._tools.indexOf(tool);
    }

    _initializeBackground() {
        const color1 = new ColorRgba(200, 200, 200);
        const color2 = new ColorRgba(240, 240, 240);
        const bgPixmap = PixmapUtils.buildCheckerBoardTile(8, color1, color2);
        this._checkerBrush = new Brush(this.gfx, bgPixmap);
    }

    processAction(action) {
        switch(action) {
            case SpriteEditor.Actions.ResetView:
                this.resetView();
                break;
        }
    }

    processKeyEvent(key, down) {

        if (key === 'Control' && this._mouseDown === false) {
            this._ctrlDown = down;
            this._untransformedOverlay.erase();
            this.sampleColor();
            this.paint();
            if (down === false) {
                this._sampledColor = null;
            }
            return;
        }

        if (down) {
            if (this.currentTool.onKeyDown(this, key)) {
                this.paint();
            }
        } else {
            if (this.currentTool.onKeyUp(this, key)) {
                this.paint();
            }
        }
    }

    resize(width, height) {
        super.resize(width, height);

        this._recalculateViewCenter();
        this._updateTransformMatrices();

        this.paint();
    }

    mirrorContentHorizontally() {
        this._pixmap.mirrorHorizontal();
        this.paint();
    }

    mirrorContentVertically() {
        this._pixmap.mirrorVertical();
        this.paint();
    }

    clear() {
        this._pixmap.erase();
        this.paint();
    }

    translate(dx, dy) {
        this._viewTransform.translate(dx, dy);

        this._updateTransformMatrices();

        this.paint();
    }

    zoom(factor) {
        this._viewTransform.reset();

        let center = new Point(
            (this.pixmap.width / 2) | 0,
            (this.pixmap.height / 2) | 0
        );

        this.zoomToPoint(factor, center);
    }

    zoomToPoint(factor, point) {
        this._viewTransform.translate(point.x, point.y);
        this._viewTransform.scale(factor);
        this._viewTransform.translate(-point.x, -point.y);

        this._updateTransformMatrices();

        this.paint();
    }

    zoomToFit() {
        const factorX = Math.ceil(this.width / this._pixmap.width) | 0;
        const factorY = Math.ceil(this.height / this._pixmap.height) | 0;
        const factor = factorX < factorY ? factorX : factorY;
        const center = new Point(
            (this._pixmap.width / 2) | 0,
            (this._pixmap.height / 2) | 0
        );
        this.resetView();
        this.zoomToPoint(factor, center);
    }

    resetView() {
        this._viewTransform.reset();
        this._recalculateViewCenter();
        this._updateTransformMatrices();
        this.paint();
    }

    setTool(toolName) {
        if (typeof this._toolsMap[toolName] !== "undefined") {
            this._toolIndex = this._toolsMap[toolName];
            this.paint();
        } else {
            console.error(`No tool registered with this name: ${toolName}`);
        }
    }

    globalPointToLocal(pos) {
        const result = new Point(pos.x, pos.y);
        this._invertedCombinedTransform.transformPoint(result);
        return result;
    }

    localPointToGlobal(pos) {
        const result = new Point(pos.x, pos.y);
        this._combinedTransform.transformPoint(result);
        return result;
    }

    globalRectToLocal(rect) {
        const result = new Rect(rect.x, rect.y, rect.width, rect.height);
        this._invertedCombinedTransform.transformRect(result);
        return result;
    }

    localRectToGlobal(rect) {
        const result = new Rect(rect.x, rect.y, rect.width, rect.height);
        this._combinedTransform.transformRect(result);
        return result;
    }

    onMouseDown(e) {
        e.preventDefault();

        this._mouseDown = true;

        if (this._ctrlDown) {
            // PickColor
            this.sampleColor();
            if (e.button === 0) {
                this._primaryColor = this._sampledColor;
                
            }
            else if (e.button === 2) {
                this._secondaryColor = this._sampledColor;
            }
            console.log(this._primaryColor);
            this.paint();
            return;
        }

        // Tooling //////////////////////////////////////////////////////
        if (e.button === 0 || e.button === 2) {
            this._mouseEvent.button = e.button;

            if (
                this._tools[this._toolIndex].onMouseDown(this, this._mouseEvent)
            ) {
                this.paint();
            }
            // Panning /////////////////////////////////////////////////
        } else if (e.button === 1) {
            this._lastPanPos.x = e.offsetX;
            this._lastPanPos.y = e.offsetY;

            this._panning = true;
        }
    }

    onMouseUp(e) {

        this._mouseDown = false;

        if(this._ctrlDown && this._sampledColor !== null) {
            this.paint();
        }

        this._mouseEvent.button = e.button;
        this._panning = false;
        if (this._tools[this._toolIndex].onMouseUp(this, this._mouseEvent)) {
            this.paint();
        }
    }

    onMouseMove(e) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        this._untransormedMousePos.x = mouseX;
        this._untransormedMousePos.y = mouseY;

        this._mousePos.x = mouseX;
        this._mousePos.y = mouseY;

        this._invertedCombinedTransform.transformPoint(this._mousePos);

        this._mousePos.x |= 0;
        this._mousePos.y |= 0;

        if (this._ctrlDown) {
            this.sampleColor();
            this.paint();
            return;
        }

        if (!this._panning) {
            this._mouseEvent.pos.x = this._mousePos.x;
            this._mouseEvent.pos.y = this._mousePos.y;
            this._mouseEvent.absPos.x = this._untransormedMousePos.x;
            this._mouseEvent.absPos.y = this._untransormedMousePos.y;
            this._tools[this._toolIndex].onMouseMove(this, this._mouseEvent);
        } else if (this._panning) {
            const zoom = this._viewTransform._m[0];

            const dx = (mouseX - this._lastPanPos.x) / zoom;
            const dy = (mouseY - this._lastPanPos.y) / zoom;

            this.translate(dx, dy);

            this._lastPanPos.x = mouseX;
            this._lastPanPos.y = mouseY;
        }

        this.paint();
    }

    sampleColor() {
        this._sampledColor = this._pixmap.getColorAt(this._mousePos.x, this._mousePos.y);
    }

    onMouseWheel(e) {
        var delta = e.wheelDelta
            ? e.wheelDelta / 40
            : e.detail
            ? -e.detail
            : e.deltaY
            ? -e.deltaY
            : 0;

        if (delta > 0) {
            if (this._viewTransform._m[0] >= 32.0) {
                return;
            }

            this.zoomToPoint(2.0, this._mousePos);
        } else if (delta < 0) {
            if (this._viewTransform._m[0] <= 0.5) {
                return;
            }

            this.zoomToPoint(0.5, this._mousePos);
        }
    }

    _updateTransformMatrices() {
        this._combinedTransform.reset();
        this._combinedTransform.multiply(this._viewCenterTransform);
        this._combinedTransform.multiply(this._viewTransform);
        this._combinedTransform.roundTranslateToNearestInteger();

        this._bgRect.x = 0;
        this._bgRect.y = 0;
        this._bgRect.width = this.pixmap.width;
        this._bgRect.height = this.pixmap.height;

        this._combinedTransform.transformRect(this._bgRect);

        this._invertedCombinedTransform = this._combinedTransform.inverse();
    }

    _recalculateViewCenter() {
        this._viewCenterTransform.reset();

        const tx = this.width / 2.0 - this._pixmap.width / 2.0;
        const ty = this.height / 2.0 - this._pixmap.height / 2.0;

        this._viewCenterTransform.translate(tx, ty);
    }

    _saveTransform() {
        this._savedTransforms.push(this._combinedTransform);
        this._gfx.save();
    }

    _restoreTransform() {
        this._combinedTransform = this._savedTransforms.pop();
        this._gfx.restore();
    }

    paint() {
        const g = this._gfx;

        g.setTransform(1, 0, 0, 1, 0, 0);
        g.fillStyle = "#333";
        g.fillRect(0, 0, this.width, this.height);
        g.fillStyle = this._checkerBrush.pattern;

        // Draw Background /////////////////////////////////////////

        const bgRect = this._bgRect;

        g.setTransform(1, 0, 0, 1, 0, 0);
        g.fillRect(bgRect.x, bgRect.y, bgRect.width, bgRect.height);

        if (this._pixmap) {
            // Draw Sprite /////////////////////////////////////////

            const transfVec = this._combinedTransform._m;

            g.setTransform(
                transfVec[0],
                transfVec[1],
                transfVec[2],
                transfVec[3],
                transfVec[4],
                transfVec[5]
            );

            g.drawImage(this._pixmap.canvas, 0, 0);

            if (this._ctrlDown && this._sampledColor !== null) {

                // OffsetX: 0,
                // OffsetY: -40,
                // Width: 16,
                // height: 16
                const pickerAttribs = SpriteEditor.PickerAttribs;
                const x1 = this._untransormedMousePos.x - pickerAttribs.Width/2 + pickerAttribs.OffsetX;
                const y1 = this._untransormedMousePos.y - pickerAttribs.Height/2 + pickerAttribs.OffsetY;
                const x2 = this._untransormedMousePos.x + pickerAttribs.Width/2 + pickerAttribs.OffsetX;
                const y2 = this._untransormedMousePos.y + pickerAttribs.Height/2 + pickerAttribs.OffsetY;

                this._untransformedOverlay.erase();
                this._untransformedOverlay.drawRect(
                    x1,
                    y1,
                    x2,
                    y2, 
                    ColorRgba.Black,
                    2);

                this._untransformedOverlay.fillRectNative( 
                    x1+2, 
                    y1+2, 
                    x2,
                    y2, 
                    this._sampledColor.alpha > 0 ? this._sampledColor : this._checkerBrush.pattern,
                );
            }

            // Draw Overlays

            g.globalCompositeOperation = "difference";
            g.drawImage(this._overlay.canvas, 0, 0);
            g.globalCompositeOperation = "source-over";
            
            g.setTransform(1, 0, 0, 1, 0, 0);
            g.drawImage(this._untransformedOverlay.canvas, 0, 0);
            
        }
    }
}
