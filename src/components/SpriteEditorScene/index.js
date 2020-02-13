import Scene from "../Scene";
import SpriteEditor from "../SpriteEditor";
import "./style.css";
import ToolBox from "../ToolBox";
import ModifiersBox from "../ModifiersBox";
import { ToolNames } from "../../model/Constants";
import Palette from "../Palette";
import SnapshotManager from "../SnapshotManager";

export default class SpriteEditorScene extends Scene {
    static InitialTool = ToolNames.Pen;
    static ShortCutBindings = {
        Tools: {
            "1": ToolNames.Pen,
            "2": ToolNames.Fill,
            "3": ToolNames.Move,
            "4": ToolNames.Rect,
            "5": ToolNames.Line,
            "6": ToolNames.Oval
        },
        Modifiers: {
            "c": ModifiersBox.ClearId,
            "h": ModifiersBox.HMirrorId,
            "v": ModifiersBox.VMirrorId,
            "l": ModifiersBox.ClearPixelLinesId
        },
        SpriteEditor: {
            "r": SpriteEditor.Actions.ResetView
        }
    };

    constructor() {
        super("sprite-editor-scene");
        this._div;
        this._toolBox;
        this._modBox;
        this._palette;
        this._spriteEditor;
        this._snapshotManager;
        this._shortcuts = {};
        this._initElements();
        this._hookupEvents();
        this._attachShortcuts();
        this._spriteEditor.saveFirstSnapshot();

    }

    get root() {
        return this._div;
    }

    _initElements() {
        this._div = document.createElement("div");
        this._div.setAttribute("id", this.id);
        this._spriteEditor = new SpriteEditor(500, 500);
        this._toolBox = new ToolBox();
        this._toolBox.populate(
            Object.values(ToolNames),
            SpriteEditorScene.InitialTool
        );
        this._toolBox.on(ToolBox.SelectEvent, this.onToolBoxSelect, this);
        this._toolBox.setOn(SpriteEditorScene.InitialTool);
        this._modBox = new ModifiersBox();
        
        this._palette = new Palette();
        this._palette.updateCurrentColorsPalette(this._spriteEditor.pixmap);

        this._snapshotManager = new SnapshotManager();
        
        this._div.append(this._palette.root);
        this._div.append(this._toolBox.root);
        this._div.append(this._spriteEditor.root);
        this._div.append(this._snapshotManager.root);
        this._div.append(this._modBox.root);
    }

    _hookupEvents() {
        this._modBox.on(
            ModifiersBox.ActionEvent,
            this.onModBoxActionTriggered,
            this
        );
        this._spriteEditor.on(SpriteEditor.Events.PixmapChanged, this.onSpriteEditorPaintDown, this);
        this._spriteEditor.on(SpriteEditor.Events.SnapshotSaved, this.onSpriteEditorSnapshotSaved, this);
        this._palette.on(Palette.SelectEvent, this.onPaletteSelect, this);
        this._snapshotManager.on(SnapshotManager.Events.SnapshotSelected, this.onSnapshotManagerSelected, this);
    }

    processKeyEvent(key, down) {
        if (down === true) {
            this._triggerShortCut(key);
        }
        this._spriteEditor.processKeyEvent(key, down);
    }

    _triggerShortCut(key) {
        if (this._shortcuts[key]) {
            this._shortcuts[key]();
        }
    }

    _attachShortcuts() {
        Object.entries(SpriteEditorScene.ShortCutBindings.Tools).forEach(
            ([key, value]) => {
                this._shortcuts[key] = () => {
                    this._toolBox.setOn(value);
                };
            }
        );
        Object.entries(SpriteEditorScene.ShortCutBindings.Modifiers).forEach(([key, value]) => {
            this._shortcuts[key] = () => {
                this._modBox.triggerModifer(value);
            };
        });
        Object.entries(SpriteEditorScene.ShortCutBindings.SpriteEditor).forEach(([key, value]) => {
            this._shortcuts[key] = () => {
                this._spriteEditor.processAction(value);
            }
        });
    }

    onToolBoxSelect(tool) {
        this._spriteEditor.setTool(tool);
    }

    onSpriteEditorPaintDown() {
        this._palette.updateCurrentColorsPalette(this._spriteEditor.pixmap);
    }

    onSpriteEditorSnapshotSaved(snapshot) {
        this._snapshotManager.addSnapshot(snapshot);
    }
    
    onPaletteSelect(paletteEvent) {
        if (paletteEvent.button === 0) {
            this._spriteEditor.primaryColor = paletteEvent.color;
        }
        else if (paletteEvent.button === 2) {
            this._spriteEditor.secondaryColor = paletteEvent.color;
        }
    }

    onSnapshotManagerSelected(snapShotKey) {
        this._spriteEditor.setSnapshot(snapShotKey);
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
