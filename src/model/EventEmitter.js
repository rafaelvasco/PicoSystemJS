export default class EventEmitter {
    constructor() {
        this._listeners = new Map();
    }

    on(label, callback, context) {
        this._listeners.has(label) || this._listeners.set(label, []);
        this._listeners.get(label).push(callback.bind(context));
    }

    remove(label, callback) {
        let listeners = this._listeners.get(label);
        let index;

        if (listeners && listeners.length) {
            index = listeners.reduce((i, listener, index) => {
                return typeof listener === "function" && listener === callback
                    ? (i = index)
                    : i;
            }, -1);

            if (index > -1) {
                listeners.splice(index, 1);
                this._listeners.set(label, listeners);
                return true;
            }
        }

        return false;
    }

    emit(label, ...args) {
        let listeners = this._listeners.get(label);

        if (listeners && listeners.length) {
            listeners.forEach(listener => {
                listener(...args);
            });

            return true;
        }

        return false;
    }
}
