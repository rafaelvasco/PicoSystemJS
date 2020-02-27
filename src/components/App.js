import CenterPanel from "./CenterPanel";
import SpriteEditorScene from "./SpriteEditorScene";
import ShortcutManager from "./ShortcutManager";
import MainMenu from "./MainMenu";
import { Dom } from "../utils/dom";

export default class App {
    constructor() {
        this._mainContainer;
        this._centerPanel;
        this._mainMenu;
        this._spriteEditor;
        this._currentScene;
        this._shortcutManager;
    }

    async init() {
        window.app = this;

        window.addEventListener("contextmenu", e => {
            e.preventDefault();
        });
        window.addEventListener("keydown", e => {
            this._onGlobalKeyDown(e);
        });
        window.addEventListener("keyup", e => {
            this._onGlobalKeyUp(e);
        });
        this._shortcutManager = new ShortcutManager();
        this._centerPanel = new CenterPanel();
        this._spriteEditorScene = new SpriteEditorScene();
        this._centerPanel.addSection(this._spriteEditorScene);
        this._currentScene = this._spriteEditorScene;

        this._mainMenu = new MainMenu();

        this._mainContainer = Dom.create("div", "mainContainer");

        this._mainContainer.append(this._centerPanel.domElement);
        this._mainContainer.append(this._mainMenu.domElement);

        // document.body.append(this._centerPanel.domElement);
        // document.body.append(this._mainMenu.domElement);
        document.body.append(this._mainContainer);

        document.addEventListener("DOMContentLoaded", () => {
            this._spriteEditorScene.updateSpriteEditorSize();
        });
    }

    _onGlobalKeyDown(e) {
        if (e.repeat) {
            return;
        }
        this._currentScene.processKeyEvent(e.key, true);
        this._shortcutManager.processKeyEvent(e.key, true);
    }

    _onGlobalKeyUp(e) {
        this._currentScene.processKeyEvent(e.key, false);
        this._shortcutManager.processKeyEvent(e.key, false);
    }
}
