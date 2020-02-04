import Button from '../Button';
import Element from '../Element';
import './style.css';

export default class TopBar extends Element {
    
    constructor() {
        super('top-bar');
        this._div = null;
        this._aboutMenuBtn = null;
        this._fileMenuBtn = null;

        this._initComponents();
    }

    get root() { return this._div; }

    _initComponents() {

        this._div = document.createElement('div');
        this._div.setAttribute('id', this.id);

        this._fileMenuBtn = new Button('file-button', 'File');
        this._aboutMenuBtn = new Button('help-button', 'Help');

        this._div.append(this._fileMenuBtn.root);
        this._div.append(this._aboutMenuBtn.root);

    }
}