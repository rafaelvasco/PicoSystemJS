import Scene from "../Scene";
import SpriteEditor from "../SpriteEditor";
import "./style.css";
import ToolBox from "../ToolBox";
import ModifiersBox from "../ModifiersBox";
import { ToolNames } from "../../model/Constants";
import Palette from "../Palette";
import SnapshotManager from "../SnapshotManager";
import ShortcutManager from "../ShortcutManager";

export default class SpriteEditorScene extends Scene {
    static InitialTool = ToolNames.Pen;

    constructor() {
        super("sprite-editor-scene");
        this._toolBox;
        this._modBox;
        this._palette;
        this._spriteEditor;
        this._snapshotManager;
        this._actions;
        this._initElements();
        this._hookupEvents();
        this._registerShortcuts();
    }

    _initElements() {
        this._spriteEditor = new SpriteEditor(1024, 768);
        this._toolBox = new ToolBox();
        this._toolBox.populate(
            Object.values(ToolNames),
            SpriteEditorScene.InitialTool
        );
        this._toolBox.on(ToolBox.SelectEvent, this.onToolBoxSelect, this);
        this._toolBox.setOn(SpriteEditorScene.InitialTool);
        this._modBox = new ModifiersBox();

        this._palette = new Palette();

        this._snapshotManager = new SnapshotManager();

        this.add(this._palette);
        this.add(this._toolBox);
        this.add(this._spriteEditor);
        this.add(this._snapshotManager);
        this.add(this._modBox);

        
    }

    updateSpriteEditorSize() {
        //this._spriteEditor.resize(this.width, this.height);
    }

    _hookupEvents() {
        this._modBox.on(
            ModifiersBox.ActionEvent,
            this.onModBoxActionTriggered,
            this
        );
        this._spriteEditor.on(
            SpriteEditor.Events.PixmapChanged,
            this.onSpriteEditorPaintDown,
            this
        );
        this._spriteEditor.on(
            SpriteEditor.Events.SnapshotSaved,
            this.onSpriteEditorSnapshotSaved,
            this
        );
        this._palette.on(Palette.SelectEvent, this.onPaletteSelect, this);
        this._snapshotManager.on(
            SnapshotManager.Events.SnapshotSelected,
            this.onSnapshotManagerSelected,
            this
        );
    }

    processKeyEvent(key, down) {
        this._spriteEditor.processKeyEvent(key, down);
    }

    _registerShortcuts() {

        const shortcutManager = ShortcutManager.Ref;

        shortcutManager.bindShortcut('1', ()=> {
            this._toolBox.setOn(ToolNames.Pen);
        }, this);

        shortcutManager.bindShortcut('2', ()=> {
            this._toolBox.setOn(ToolNames.Fill);
        }, this);

        shortcutManager.bindShortcut('3', ()=> {
            this._toolBox.setOn(ToolNames.Move);
        }, this);

        shortcutManager.bindShortcut('4', ()=> {
            this._toolBox.setOn(ToolNames.Rect);
        }, this);

        shortcutManager.bindShortcut('5', ()=> {
            this._toolBox.setOn(ToolNames.Line);
        }, this);

        shortcutManager.bindShortcut('6', ()=> {
            this._toolBox.setOn(ToolNames.Oval);
        }, this);

        shortcutManager.bindShortcut('c', ()=> {
            this._spriteEditor.clear();
        }, this);
        
        shortcutManager.bindShortcut('r', ()=> {
            this._spriteEditor.resetView();
        }, this);

        shortcutManager.bindShortcut('r', ()=> {
            this._spriteEditor.resetView();
        }, this);

        shortcutManager.bindShortcut('h', ()=> {
            this._modBox.triggerModifer(ModifiersBox.HMirrorId);
        }, this);

        shortcutManager.bindShortcut('v', ()=> {
            this._modBox.triggerModifer(ModifiersBox.VMirrorId);
        }, this);

        shortcutManager.bindShortcut('Ctrl+Z', ()=> {
            this._snapshotManager.undo();
        }, this);

        shortcutManager.bindShortcut('Ctrl+Shift+Z', ()=> {
            this._snapshotManager.redo();
        }, this);

        shortcutManager.bindShortcut('Ctrl+Y', ()=> {
            this._snapshotManager.redo();
        }, this);

    }

    onToolBoxSelect(tool) {
        this._spriteEditor.setTool(tool);
    }

    onSpriteEditorPaintDown() {
        this._palette.updateCurrentColorsPalette(this._spriteEditor.pixmap);
    }

    onSpriteEditorSnapshotSaved(snapshots, currentSnapshotIndex) {
        this._snapshotManager.updateSnapshotList(
            snapshots,
            currentSnapshotIndex
        );
    }

    onPaletteSelect(paletteEvent) {
        if (paletteEvent.button === 0) {
            this._spriteEditor.primaryColor = paletteEvent.color;
        } else if (paletteEvent.button === 2) {
            this._spriteEditor.secondaryColor = paletteEvent.color;
        }
    }

    onSnapshotManagerSelected(index) {
        this._spriteEditor.setSnapshot(index);
    }

    onModBoxActionTriggered(action) {
        switch (action) {
            case ModifiersBox.ClearAction:
                this._spriteEditor.clear();
                break;
            case ModifiersBox.EnableHMirrorAction:
                this._spriteEditor.mirrorX = true;
                break;
            case ModifiersBox.DisableHMirrorAction:
                this._spriteEditor.mirrorX = false;
                break;
            case ModifiersBox.EnableVMirrorAction:
                this._spriteEditor.mirrorY = true;
                break;
            case ModifiersBox.DisableVMirrorAction:
                this._spriteEditor.mirrorY = false;
                break;
        }
    }
}
