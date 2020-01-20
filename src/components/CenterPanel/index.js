import Element from "../Element";
import './style.css';

export default class CenterPanel extends Element {
    constructor() {
        super('center-panel');
        this._div = null;
        this._initElements;
        this._sections = [];
        this._initElements();
        this._sectionIndex = 0;
    }

    get root() { return this._div; }

    _initElements() {
        this._div = document.createElement('div');
        this._div.setAttribute('id', 'center-panel');
    }

    addSection(element) {
        this._sections.push(element.id);
        this._div.appendChild(element.root);
    }
}