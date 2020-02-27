import EventEmitter from "../model/EventEmitter";
import { Dom } from "../utils/dom";

export default class Element extends EventEmitter {

    get id() { return this._id; }

    constructor(params) {

        super();
        this._domElement = Dom.create(params.elementTag || 'div');
        this._domElement.setAttribute('id', params.id);
        if (params.className) {
            this._domElement.classList.add(params.className);
        }
        if (params.label) {
            this._domElement.textContent = params.label;
        }
        this._id = params.id;
    }

    addClass(className) {
        this._domElement.classList.add(className);
    }

    removeClass(className) {
        this._domElement.classList.remove(className);
    }

    get style() {
        return this._domElement.style;
    }

    get width() {
        return this._domElement.width || this._domElement.clientWidth;
    }

    get height() {
        return this._domElement.height || this._domElement.clientHeight;
    }

    on(event, callback, context) {
        this._domElement.addEventListener(event, callback.bind(context));
    }

    add(element) {
        this.domElement.append(element.domElement || element);
    }

    get domElement() { return this._domElement; }
}