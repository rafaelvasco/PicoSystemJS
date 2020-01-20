import EventEmitter from "../model/EventEmitter";

export default class Element extends EventEmitter {

    get id() { return this._id; }

    constructor(id) {
        super();
        this._id = id;
    }
    get root() {}
}