import Scene from "../Scene";
import SpriteEditor from "../SpriteEditor";
import "./style.css";
import ToolBox from "../ToolBox";
import ModifiersBox from "../ModifiersBox";
import { ToolNames } from "../../model/Constants";

export default class SpriteEditorScene extends Scene {
    static InitialTool = ToolNames.Pen;
    static ShortCutBindings = {
        Tools: {
            "1": ToolNames.Pen,
            "2": ToolNames.Fill,
            "3": ToolNames.Move,
            "4": ToolNames.Rect
        },
        Modifiers: {

            "c": ModifiersBox.ClearId,
            "h": ModifiersBox.HMirrorId,
            "v": ModifiersBox.VMirrorId
        }
    };

    constructor() {
        super("sprite-editor-scene");
        this._div;
        this._toolBox;
        this._modBox;
        this._spriteEditor;
        this._shortcuts = {};
        this._initElements();
        this._attachShortcuts();
    }

    get root() {
        return this._div;
    }

    _initElements() {
        this._div = document.createElement("div");
        this._div.setAttribute("id", this.id);
        this._spriteEditor = new SpriteEditor(640, 480);
        this._toolBox = new ToolBox();
        this._toolBox.populate(
            Object.values(ToolNames),
            SpriteEditorScene.InitialTool
        );
        this._toolBox.on(ToolBox.SelectEvent, this.onToolBoxSelect, this);
        this._toolBox.setOn(SpriteEditorScene.InitialTool);
        this._modBox = new ModifiersBox();
        this._modBox.on(
            ModifiersBox.ActionEvent,
            this.onModBoxActionTriggered,
            this
        );
        this._div.appendChild(this._toolBox.root);
        this._div.appendChild(this._spriteEditor.root);
        this._div.appendChild(this._modBox.root);
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
    }

    onToolBoxSelect(tool) {
        this._spriteEditor.setTool(tool);
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
