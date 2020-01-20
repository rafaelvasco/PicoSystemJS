import TopBar from './TopBar';
import CenterPanel from './CenterPanel';
import SpriteEditorScene from './SpriteEditorScene';

export default class App {

    constructor() {
        this._centerPanel;
        this._topbar;
        this._spriteEditor;
        this._currentScene;
    }

    async init() {
        
        window.addEventListener('contextmenu', (e) => { e.preventDefault(); });
        window.addEventListener('keydown', (e) => { this.onGlobalKeyDown(e); });
        window.addEventListener('keyup', (e) => { this.onGlobalKeyUp(e); });
        this._centerPanel = new CenterPanel();
        this._topbar = new TopBar();
        this._spriteEditorScene = new SpriteEditorScene();
        this._centerPanel.addSection(this._spriteEditorScene);

        this._currentScene = this._spriteEditorScene;

        document.body.appendChild(this._topbar.root);
        document.body.appendChild(this._centerPanel.root);
    }

    onGlobalKeyDown(e) {
        if (e.repeat) {
            return;
        }
        this._currentScene.processKeyEvent(e.key, true);
    }    

    onGlobalKeyUp(e) {
        this._currentScene.processKeyEvent(e.key, false);
    }
    
}